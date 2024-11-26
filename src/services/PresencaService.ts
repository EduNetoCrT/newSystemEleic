import { Between, Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { Eleitor, StatusEnum } from "../entities/Eleitor";
import { Presenca } from "../entities/Presenca";
import { Sessao } from "../entities/Sessao";
import { ErrorApp } from "../utils/ErrorApp";
import { endOfDay, startOfDay } from "date-fns";

export class PresencaService {
  private presencaRepository: Repository<Presenca>;
  private secaoRepository: Repository<Sessao>;
  private eleitorRepository: Repository<Eleitor>;

  constructor() {
    this.presencaRepository = AppDataSource.getRepository(Presenca);
    this.secaoRepository = AppDataSource.getRepository(Sessao);
    this.eleitorRepository = AppDataSource.getRepository(Eleitor);
  }

  async getPresencaCountBySessao(): Promise<
    { sessaoId: number; local: string; presencaCount: number }[]
  > {
    const query = await this.presencaRepository
      .createQueryBuilder("presenca")
      .leftJoinAndSelect("presenca.sessao", "sessao")
      .select("sessao.id", "sessaoId")
      .addSelect("sessao.local", "local")
      .addSelect("COUNT(presenca.id)", "presencaCount")
      .groupBy("sessao.id")
      .addGroupBy("sessao.local")
      .orderBy("sessao.id", "ASC") // Ordena pelo ID da sessão em ordem crescente
      .getRawMany();

    return query;
  }

  // Busca todas as presenças com as relações eleitor e sessão
  async getAllPresencas(): Promise<Presenca[]> {
    return this.presencaRepository.find({ relations: ["sessao", "eleitor"] });
  }

  // Busca eleitor por matrícula e lança erro se não encontrado
  async buscarEleitorPorMatricula(matricula: string): Promise<Eleitor> {
    const eleitor = await this.eleitorRepository.findOne({
      where: { matricula },
    });
    if (!eleitor)
      throw new ErrorApp({ message: "Eleitor não encontrado", status: 404 });
    return eleitor;
  }

  // Busca presença por ID
  async getPresencaById(id: string): Promise<Presenca | null> {
    return this.presencaRepository.findOne({
      where: { id },
      relations: ["sessao", "eleitor"],
    });
  }

  // Cria uma nova presença
  async createPresenca(
    secaoId: string,
    eleitorMatricula: string
  ): Promise<Presenca> {
    const secao = await this.secaoRepository.findOneBy({ id: secaoId });

    if (!secao) {
      throw new Error("Seção não cadastrada");
    }

    // Verifica se o eleitor já registrou presença hoje
    await this.verificarPresencaEleitor(secaoId, eleitorMatricula);

    // Busca a sessão pelo local e o eleitor pela matrícula
    const sessao = await this.secaoRepository.findOne({
      where: { id: secaoId },
    });
    const eleitor = await this.buscarEleitorPorMatricula(eleitorMatricula);

    if (!sessao) {
      throw new ErrorApp({
        message: "Sessão não encontrada para o local informado",
        status: 404,
      });
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
    const presenca = this.presencaRepository.create({
      sessao,
      eleitor,
      dataPresenca: new Date(),
    });

    // Salva a presença no banco
    const presencaSalva = await this.presencaRepository.save(presenca);

    // Retorna a presença salva com a sessão completa
    return presencaSalva;
  }

  // Verifica se o eleitor já registrou presença na sessão no dia atual
  private async verificarPresencaEleitor(
    secaoId: string,
    eleitorMatricula: string
  ): Promise<void> {
    const hoje = new Date();
    const inicioHoje = startOfDay(hoje);
    const fimHoje = endOfDay(hoje);

    // Verifica se já existe presença do eleitor no dia atual
    const presencaHoje = await this.presencaRepository.findOne({
      where: {
        eleitor: { matricula: eleitorMatricula },
        sessao: { id: secaoId },
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
