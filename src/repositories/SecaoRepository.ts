import { Repository } from "typeorm";
import { Sessao as Secao } from "../entities/Sessao";
import { AppDataSource } from "../database/data-source";

export class SecaoRepository {
  private repository: Repository<Secao>;

  constructor() {
    this.repository = AppDataSource.getRepository(Secao);
  }

  async findById(id: string): Promise<Secao | null> {
    return this.repository.findOneBy({ id: "" + id });
  }

  async findAll(): Promise<Secao[]> {
    return this.repository.find();
  }

  async create(data: Partial<Secao>): Promise<Secao> {
    const secao = this.repository.create(data);
    return this.repository.save(secao);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
