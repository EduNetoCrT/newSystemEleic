import { Request, Response } from "express";
import { ChapaService } from "../services/ChapaService";
import { ChapaRepository } from "../repositories/ChapaRepository";

const chapaRepository = new ChapaRepository();
const chapaService = new ChapaService(chapaRepository);

export class ChapaController {
  static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { nome, candidatos } = req.body;
      const chapa = await chapaService.create({ nome, candidatos });
      return res.status(201).json(chapa);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const chapas = await chapaService.getAll();
      return res.json(chapas);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const chapa = await chapaService.getById(Number(id));
      return res.json(chapa);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }

  static async addCandidatos(req: Request, res: Response): Promise<Response> {
    try {
      const { chapaId } = req.params;
      const { candidatos } = req.body;

      // Validação básica: lista de candidatos não pode estar vazia
      if (!candidatos || candidatos.length === 0) {
        return res
          .status(400)
          .json({ message: "A lista de candidatos não pode estar vazia." });
      }

      await chapaService.addCandidatos(Number(chapaId), candidatos);

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}
