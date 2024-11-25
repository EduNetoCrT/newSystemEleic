import { CandidatoRepository } from "../repositories/CandidatoRepository";
import { Candidato } from "../entities/Candidato";

export class CandidatoService {
  private candidatoRepository: CandidatoRepository;

  constructor(candidatoRepository: CandidatoRepository) {
    this.candidatoRepository = candidatoRepository;
  }

  async create(data: Partial<Candidato>): Promise<Candidato> {
    if (!data.nome || !data.funcao || !data.chapa) {
      throw new Error("Nome, função e chapa são obrigatórios.");
    }
    return this.candidatoRepository.create(data);
  }

  async getAll(): Promise<Candidato[]> {
    return this.candidatoRepository.findAll();
  }

  async getById(id: number): Promise<Candidato> {
    const candidato = await this.candidatoRepository.findById(id);
    if (!candidato) {
      throw new Error("Candidato não encontrado.");
    }
    return candidato;
  }

  async update(id: number, data: Partial<Candidato>): Promise<Candidato> {
    const candidato = await this.candidatoRepository.update(id, data);
    if (!candidato) {
      throw new Error("Candidato não encontrado para atualização.");
    }
    return candidato;
  }

  async delete(id: number): Promise<void> {
    const candidato = await this.candidatoRepository.findById(id);
    if (!candidato) {
      throw new Error("Candidato não encontrado para exclusão.");
    }
    await this.candidatoRepository.delete(id);
  }
}
