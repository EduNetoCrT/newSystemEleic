import { Between, Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { Eleitor, StatusEnum } from "../entities/Eleitor";
import { Presenca } from "../entities/Presenca";
import { Sessao } from "../entities/Sessao";
import { ErrorApp } from "../utils/ErrorApp";
import { endOfDay, startOfDay } from "date-fns";

export class PresencaService {
  private presencaRepository: Repository<Presenca>;
  private sessaoRepository: Repository<Sessao>;
  private eleitorRepository: Repository<Eleitor>;

  constructor() {
    this.presencaRepository = AppDataSource.getRepository(Presenca);
    this.sessaoRepository = AppDataSource.getRepository(Sessao);
    this.eleitorRepository = AppDataSource.getRepository(Eleitor);
  }

  // Busca todas as presenças com as relações eleitor e sessão
  async getAllPresencas(): Promise<Presenca[]> {
    return this.presencaRepository.find({ relations: ["sessao", "eleitor"] });
  }

  // Busca eleitor por matrícula e lança erro se não encontrado
  async buscarEleitorPorMatricula(matricula: string): Promise<Eleitor> {
    const eleitor = await this.eleitorRepository.findOne({ where: { matricula } });
    if (!eleitor) throw new ErrorApp({ message: "Eleitor não encontrado", status: 404 });
    return eleitor;
  }

  // Busca presença por ID
  async getPresencaById(id: string): Promise<Presenca | null> {
    return this.presencaRepository.findOne({ where: { id }, relations: ["sessao", "eleitor"] });
  }

  // Cria uma nova presença
  async createPresenca(sessaoId: string, eleitorMatricula: string): Promise<Presenca> {
    console.log(`Eleitor ID: ${eleitorMatricula}, Sessão ID: ${sessaoId}`);

    // Verifica se o eleitor já registrou presença hoje
    await this.verificarPresencaEleitor(sessaoId, eleitorMatricula);

    // Busca a sessão e o eleitor
    const sessao = await this.sessaoRepository.findOne({ where: { id: sessaoId } });
    const eleitor = await this.buscarEleitorPorMatricula(eleitorMatricula);

    if (!sessao) {
      throw new ErrorApp({ message: "Sessão não encontrada", status: 404 });
    }

    // Verifica se o eleitor está inapto
    if (eleitor.status === StatusEnum.INAPTO) {
      throw new ErrorApp({
        message: "Eleitor Inapto, favor procurar gerência",
        status: 400,
      });
    }

    // Marca o eleitor como já votou
    eleitor.votou = true; // Atualize o status de 'votou' para verdadeiro
    await this.eleitorRepository.save(eleitor); // Salva a atualização no banco

    // Cria a presença
    const presenca = this.presencaRepository.create({ sessao, eleitor, dataPresenca: new Date() });
    return this.presencaRepository.save(presenca);
  }

  // Verifica se o eleitor já registrou presença na sessão no dia atual
  private async verificarPresencaEleitor(
    sessaoId: string,
    eleitorMatricula: string
  ): Promise<void> {
    const hoje = new Date();
    const inicioHoje = startOfDay(hoje);
    const fimHoje = endOfDay(hoje);

    // Verifica se já existe presença do eleitor no dia atual
    const presencaHoje = await this.presencaRepository.findOne({
      where: {
        eleitor: { matricula: eleitorMatricula },
        dataPresenca: Between(inicioHoje, fimHoje),
      },
      relations: ["sessao"],
    });

    if (presencaHoje) {
      throw new ErrorApp({
        message: `Eleitor já possui presença registrada hoje na sessão ${presencaHoje.sessao.local} - ${presencaHoje.sessao.numero}`,
        status: 400,
      });
    }
  }
}
