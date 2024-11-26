import { Request, Response } from "express";
import { VotoService } from "../services/VotoService";
import { VotoRepository } from "../repositories/VotoRepository";
import { CandidatoRepository } from "../repositories/CandidatoRepository";
import { SecaoRepository } from "../repositories/SecaoRepository";

const votoRepository = new VotoRepository();
const candidatoRepository = new CandidatoRepository();
const secaoRepository = new SecaoRepository();
const votoService = new VotoService(
  votoRepository,
  secaoRepository,
  candidatoRepository
);

export class VotoController {
  static async addVote(req: Request, res: Response): Promise<Response> {
    try {
      const { secaoId, quantidade, candidatoId } = req.body;

      // Validação básica
      if (!secaoId || !quantidade || !candidatoId) {
        return res.status(400).json({
          message:
            "Os campos secaoId, quantidade e candidatoId são obrigatórios.",
        });
      }

      // Adicionar o voto
      await votoService.addVote({ secaoId, quantidade, candidatoId });

      // Sucesso: Retorna 204 No Content
      return res.status(204).send();
    } catch (error) {
      // Erro: Retorna 400 Bad Request com a mensagem de erro
      return res.status(400).json({ message: error.message });
    }
  }

  static async addVotes(req: Request, res: Response): Promise<Response> {
    try {
      const { votos } = req.body;

      console.log(votos);
      

      // Validação básica
      if (!votos || !Array.isArray(votos) || votos.length === 0) {
        return res.status(400).json({
          message: "A lista de votos é obrigatória e não pode estar vazia.",
        });
      }

      // Validar estrutura de cada voto
      for (const voto of votos) {
        if (!voto.secaoId || !voto.quantidade && voto.quantidade < 0 || !voto.candidatoId) {         
          return res.status(400).json({
            message:
              "Cada voto deve conter os campos secaoId, quantidade e candidatoId.",
          });
        }
      }

      console.log(votos[0]);
      

      // Adicionar votos
      await votoService.addVotes(votos);

      // Sucesso: Retorna 204 No Content
      return res.status(204).send();
    } catch (error) {
      // Erro: Retorna 400 Bad Request com a mensagem de erro
      return res.status(400).json({ message: error.message });
    }
  }

  static async getVotesByCandidato(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { candidatoId } = req.params;

      if (!candidatoId) {
        return res
          .status(400)
          .json({ message: "O campo candidatoId é obrigatório." });
      }

      const votos = await votoService.getVotesByCandidato(Number(candidatoId));

      return res.json(votos);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}
