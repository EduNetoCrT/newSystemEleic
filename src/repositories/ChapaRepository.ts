import { EntityManager, Repository } from "typeorm";
import { Chapa } from "../entities/Chapa";
import { AppDataSource } from "../database/data-source";
import { Candidato } from "../entities/Candidato";

export class ChapaRepository {
  private repository: Repository<Chapa>;

  constructor() {
    this.repository = AppDataSource.getRepository(Chapa);
  }

  async create(data: Partial<Chapa>): Promise<Chapa> {
    const chapa = this.repository.create(data);
    return this.repository.save(chapa);
  }

  async createWithCandidatos(data: Partial<Chapa>, transactionManager?: EntityManager): Promise<Chapa> {
    const manager = transactionManager || AppDataSource.manager;

    return await manager.transaction(async (transactionalEntityManager) => {
      const chapa = transactionalEntityManager.create(Chapa, { nome: data.nome });

      // Salvar a chapa
      const savedChapa = await transactionalEntityManager.save(chapa);

      // Criar os candidatos associados, se existirem
      if (data.candidatos && data.candidatos.length > 0) {
        const candidatos = data.candidatos.map((candidato) =>
          transactionalEntityManager.create(Candidato, {
            ...candidato,
            chapa: savedChapa,
          })
        );
        await transactionalEntityManager.save(Candidato, candidatos);
      }

      return savedChapa;
    });
  }


  async addCandidatosToChapa(chapaId: number, candidatos: Partial<Candidato>[]): Promise<Chapa> {
    return await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
      // Buscar a chapa existente
      const chapa = await transactionalEntityManager.findOne(Chapa, {
        where: { id: chapaId },
        relations: ["candidatos"],
      });

      if (!chapa) {
        throw new Error("Chapa não encontrada.");
      }

      // Criar os novos candidatos associados à chapa
      const novosCandidatos = candidatos.map((candidato) =>
        transactionalEntityManager.create(Candidato, {
          ...candidato,
          chapa,
        })
      );
      await transactionalEntityManager.save(Candidato, novosCandidatos);

      // Retornar a chapa com os novos candidatos adicionados
      chapa.candidatos.push(...novosCandidatos);
      return chapa;
    });
  }

  async findAll(): Promise<Chapa[]> {
    return this.repository.find({ relations: ["candidatos", "candidatos.votos"] });
  }

  async findById(id: number): Promise<Chapa | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["candidatos", "candidatos.votos"],
    });
  }

  async findAllWithCandidatosAndVotos(): Promise<Chapa[]> {
    return this.repository.find({
      relations: ["candidatos", "candidatos.votos", "candidatos.votos.secao"],
    });
  }
}
