import { Between, Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { Eleitor, StatusEnum } from "../entities/Eleitor";
import { Presenca } from "../entities/Presenca";
import { Sessao } from "../entities/Sessao";
import { ErrorApp } from "../utils/ErrorApp";
import { addDays, endOfDay, startOfDay } from "date-fns";

export class PresencaService {
  private presencaRepository: Repository<Presenca>;
  private sessaoRepository: Repository<Sessao>;
  private eleitorRepository: Repository<Eleitor>;

  constructor() {
    this.presencaRepository = AppDataSource.getRepository(Presenca);
    this.sessaoRepository = AppDataSource.getRepository(Sessao);
    this.eleitorRepository = AppDataSource.getRepository(Eleitor);
  }

  async getAllPresencas(): Promise<Presenca[]> {
    return this.presencaRepository.find({ relations: ["sessao", "eleitor"] });
  }

  async buscarEleitorPorMatricula(matricula: string): Promise<Eleitor | null> {
    const eleitor = await this.eleitorRepository.findOne({ where: { matricula } });
    if (!eleitor) throw new ErrorApp({ message: "Eleitor não encontrado", status: 404 });
    return eleitor;
  }

  

  async getPresencaById(id: string): Promise<Presenca | null> {
      return this.presencaRepository.findOne({ where: { id }, relations: ["sessao", "eleitor"] });
  }

  async createPresenca(
    sessaoId: string,
    eleitorMatricula: string
  ): Promise<Presenca> {

    console.log(`Eleitor ID: ${eleitorMatricula}, Sessão ID: ${sessaoId}`);
    await this.verificarPresencaEleitor(sessaoId, eleitorMatricula);
    const sessao = await this.sessaoRepository.findOne({
      where: { id: sessaoId },
    });
    const eleitor = await this.eleitorRepository.findOne({
      where: { matricula: eleitorMatricula },
    });

    if (!sessao || !eleitor) {
      throw new ErrorApp({
        message: "Sessão ou Eleitor não encontrado",
        status: 404,
      });
    }

    if (eleitor.status === StatusEnum.INAPTO) {
      throw new ErrorApp({
        message: "Eleitor Inapto, favor procurar gerencia",
        status: 400,
      });
    }

    const presenca = this.presencaRepository.create({ sessao, eleitor });
    return this.presencaRepository.save(presenca);
  }


//   async buscarEleitorPorMatricula(matricula: string): Promise<Eleitor | null> {
//     return this.eleitorRepository.findOne({ where: { matricula } });
// }

  // async deletePresenca(id: string): Promise<void> {
  //     await this.presencaRepository.delete(id);
  // }

  private async verificarPresencaEleitor(
    sessaoId: string,
    eleitorMatricula: string
  ): Promise<void> {
    const hoje = new Date();
    const inicioHoje = startOfDay(hoje);
    const fimHoje = endOfDay(hoje);

    const presencaHoje = await this.presencaRepository.findOne({
      where: {
        eleitor: { matricula: eleitorMatricula },
        sessao: { created_at: Between(inicioHoje, fimHoje) },
      },
      relations: ["sessao"],
    });

    if (presencaHoje) {
      throw new ErrorApp({
        message: `Eleitou já possui presença registrada hoje na sessão ${presencaHoje?.sessao.local} - ${presencaHoje?.sessao.numero}`,
        status: 400,
      });
    }
  }
}
