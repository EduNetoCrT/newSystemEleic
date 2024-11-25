import { ChapaRepository } from "../repositories/ChapaRepository";
import { Chapa } from "../entities/Chapa";
import { Candidato } from "../entities/Candidato";

export class ChapaService {
  private chapaRepository: ChapaRepository;

  constructor(chapaRepository: ChapaRepository) {
    this.chapaRepository = chapaRepository;
  }

  async create(data: Partial<Chapa>): Promise<Chapa> {
    if (!data.nome) {
      throw new Error("Nome da chapa é obrigatório");
    }

    return this.chapaRepository.createWithCandidatos(data);
  }

  async getAll(): Promise<Chapa[]> {
    return this.chapaRepository.findAll();
  }

  async getById(id: number): Promise<Chapa> {
    const chapa = await this.chapaRepository.findById(id);

    if (!chapa) {
      throw new Error("Chapa não encontrada");
    }

    return chapa;
  }

  async addCandidatos(chapaId: number, candidatos: Partial<Candidato>[]): Promise<Chapa> {
    if (!candidatos || candidatos.length === 0) {
      throw new Error("A lista de candidatos não pode estar vazia.");
    }

    return this.chapaRepository.addCandidatosToChapa(chapaId, candidatos);
  }
}
