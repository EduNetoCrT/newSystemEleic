import { VotoRepository } from "../repositories/VotoRepository";
import { CandidatoRepository } from "../repositories/CandidatoRepository";
import { Voto } from "../entities/Voto";
import { SecaoRepository } from "../repositories/SecaoRepository";

export class VotoService {
  private votoRepository: VotoRepository;
  private secaoRepository: SecaoRepository;
  private candidatoRepository: CandidatoRepository;

  constructor(
    votoRepository: VotoRepository,
    secaoRepository: SecaoRepository,
    candidatoRepository: CandidatoRepository
  ) {
    this.votoRepository = votoRepository;
    this.secaoRepository = secaoRepository;
    this.candidatoRepository = candidatoRepository;
  }

  async addVote(data: {
    secaoId: number;
    quantidade: number;
    candidatoId: number;
  }): Promise<void> {
    const { secaoId, quantidade, candidatoId } = data;

    // Validar se a seção existe
    const secao = await this.secaoRepository.findById(secaoId);
    if (!secao) {
      throw new Error("Seção não encontrada.");
    }

    // Validar se o candidato existe
    const candidato = await this.candidatoRepository.findById(candidatoId);
    if (!candidato) {
      throw new Error("Candidato não encontrado.");
    }

    // Adicionar o voto
    await this.votoRepository.create({ secao, quantidade, candidato });
  }

  async addVotes(
    votos: { secaoId: number; quantidade: number; candidatoId: number }[]
  ): Promise<void> {
    await this.votoRepository.addVotesInTransaction(
      votos,
      this.secaoRepository,
      this.candidatoRepository
    );
  }
  async getVotesByCandidato(candidatoId: number): Promise<Voto[]> {
    return this.votoRepository.findByCandidato(candidatoId);
  }
}
