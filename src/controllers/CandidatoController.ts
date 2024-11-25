import { Request, Response } from "express";
import { CandidatoService } from "../services/CandidatoService";
import { CandidatoRepository } from "../repositories/CandidatoRepository";

const candidatoRepository = new CandidatoRepository();
const candidatoService = new CandidatoService(candidatoRepository);

export class CandidatoController {
  static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { nome, funcao, chapa, matricula } = req.body;
      const candidato = await candidatoService.create({ nome, funcao, chapa, matricula });
      return res.status(201).json(candidato);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const candidatos = await candidatoService.getAll();
      return res.json(candidatos);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const candidato = await candidatoService.getById(Number(id));
      return res.json(candidato);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }

  static async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;
      const candidato = await candidatoService.update(Number(id), data);
      return res.json(candidato);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await candidatoService.delete(Number(id));
      return res.status(204).send();
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }
}
