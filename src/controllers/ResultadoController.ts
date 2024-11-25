import { Request, Response } from "express";
import { ResultadoService } from "../services/ResultadoService";
import { ChapaRepository } from "../repositories/ChapaRepository";

const chapaRepository = new ChapaRepository();
const resultadoService = new ResultadoService(chapaRepository);

export class ResultadoController {
  static async getResultados(req: Request, res: Response): Promise<Response> {
    try {
      const resultados = await resultadoService.getResultados();
      return res.json(resultados);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
