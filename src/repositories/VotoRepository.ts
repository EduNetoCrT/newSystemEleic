import { EntityManager, Repository } from "typeorm";
import { Voto } from "../entities/Voto";
import { AppDataSource } from "../database/data-source";
import { SecaoRepository } from "./SecaoRepository";
import { CandidatoRepository } from "./CandidatoRepository";

export class VotoRepository {
  private repository: Repository<Voto>;

  constructor() {
    this.repository = AppDataSource.getRepository(Voto);
  }

  async create(data: Partial<Voto>): Promise<Voto> {
    const voto = this.repository.create(data);
    return this.repository.save(voto);
  }

  async update(data: Partial<Voto>): Promise<Voto> {
    return this.repository.save(data);
  }


  async addVotesInTransaction(
    votos: { secaoId: number; quantidade: number; candidatoId: number }[],
    secaoRepository: SecaoRepository,
    candidatoRepository: CandidatoRepository
  ): Promise<void> {
    await AppDataSource.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        for (const voto of votos) {
          const { secaoId, candidatoId, quantidade } = voto;

          // Validar se a seção existe
          const secao = await secaoRepository.findById("" + secaoId);
          if (!secao) {
            throw new Error(`Seção com ID ${secaoId} não encontrada.`);
          }

          // Validar se o candidato existe
          const candidato = await candidatoRepository.findById(candidatoId);
          if (!candidato) {
            throw new Error(`Candidato com ID ${candidatoId} não encontrado.`);
          }

          // Verificar se o voto já existe
          let existingVote = await transactionalEntityManager.findOne(Voto, {
            where: {
              secao: { id: "" + secaoId },
              candidato: { id: candidatoId },
            },
            relations: ["secao", "candidato"],
          });

          if (existingVote) {
            // Sobrescrever a quantidade se já existir
            existingVote.quantidade = quantidade;
            await transactionalEntityManager.save(existingVote);
          } else {
            // Criar um novo registro se não existir
            const novoVoto = transactionalEntityManager.create(Voto, {
              secao,
              candidato,
              quantidade,
            });
            await transactionalEntityManager.save(novoVoto);
          }
        }
      }
    );
  }

  async findByCandidato(candidatoId: number): Promise<Voto[]> {
    return this.repository.find({
      where: { candidato: { id: candidatoId } },
      relations: ["candidato", "secao"], // Inclui a relação com a seção
    });
  }

  async findByCandidatoAndSecao(
    candidatoId: number,
    secaoId: number
  ): Promise<Voto | null> {
    return this.repository.findOne({
      where: {
        candidato: { id: candidatoId },
        secao: { id: "" + secaoId },
      },
      relations: ["candidato", "secao"], // Inclui relações
    });
  }
}
