import { CandidatoRepository } from "../repositories/CandidatoRepository";
import { Candidato } from "../entities/Candidato";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

export class CandidatoService {
  private candidatoRepository: CandidatoRepository;

  constructor(candidatoRepository: CandidatoRepository) {
    this.candidatoRepository = candidatoRepository;
  }

  async create(data: Partial<Candidato>): Promise<Candidato> {
    const candidato = await this.candidatoRepository.create(data);

    const errors = await validate(candidato);
    if (errors.length > 0) {
      throw new Error(errors.map((err) => Object.values(err.constraints || {})).join(", "));
    }

    const savedCandidato = await this.candidatoRepository.save(candidato);

    // Retorna o candidato formatado
    return plainToInstance(Candidato, savedCandidato);
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
