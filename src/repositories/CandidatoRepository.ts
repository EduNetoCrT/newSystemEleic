import { Repository } from "typeorm";
import { Candidato } from "../entities/Candidato";
import { AppDataSource } from "../database/data-source";

export class CandidatoRepository {
  private repository: Repository<Candidato>;

  constructor() {
    this.repository = AppDataSource.getRepository(Candidato);
  }

  async create(data: Partial<Candidato>): Promise<Candidato> {
    const candidato = this.repository.create(data);
    return this.save(candidato);
  }

  async save(data: Candidato): Promise<Candidato> {
    return this.repository.save(data);
  }

  async findAll(): Promise<Candidato[]> {
    return this.repository.find({ relations: ["chapa", "votos"] });
  }

  async findById(id: number): Promise<Candidato | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["chapa", "votos"],
    });
  }

  async update(id: number, data: Partial<Candidato>): Promise<Candidato | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
