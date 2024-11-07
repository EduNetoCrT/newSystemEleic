// src/controllers/EleitorController.ts

import { NextFunction, Request, Response } from "express";
import { EleitorService } from "../services/EleitorService";

export class EleitorController {
  private eleitorService: EleitorService;

  constructor() {
    this.eleitorService = new EleitorService();
  }

  getAllEleitores = async (req: Request, res: Response): Promise<void> => {
    try {
      const eleitores = await this.eleitorService.getAllEleitores();
      res.json(eleitores);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar eleitores" });
    }
  };

  getEleitorByMatricula = async (req: Request, res: Response): Promise<void> => {
    try {
      const matricula = req.params.matricula;
      const eleitor = await this.eleitorService.getEleitorByMatricula(matricula);
      if (eleitor) {
        res.json(eleitor);
      } else {
        res.status(404).json({ message: "Eleitor não encontrado" });
      }
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar eleitor" });
    }
  };

  createEleitor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { matricula, nome, cpf, patente, status } = req.body;
      const newEleitor = await this.eleitorService.createEleitor(
        matricula,
        nome,
        cpf,
        patente,
        status
      );

      res.status(201).json(newEleitor);
    } catch (error) {
      next(error);
    }
  };

  updateEleitor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { matricula, nome, patente, status } = req.body;
      await this.eleitorService.updateEleitorByMatricula(
        matricula,
        nome,
        patente,
        status
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  deleteEleitor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const matricula = req.params.matricula;
      await this.eleitorService.deleteEleitor(matricula);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar eleitor" });
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { matricula, status } = req.body;
      await this.eleitorService.updateStatusByMatricula(matricula, status);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
 
}
