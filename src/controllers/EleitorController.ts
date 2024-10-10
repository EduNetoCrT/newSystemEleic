import { NextFunction, Request, Response } from "express";
import { EleitorService } from "../services/EleitorService";

export class EleitorController {
  private eleitorService: EleitorService;

  constructor() {
    this.eleitorService = new EleitorService();
  }

  // Método para buscar todos os eleitores
  getAllEleitores = async (req: Request, res: Response): Promise<void> => {
    try {
      const eleitores = await this.eleitorService.getAllEleitores();
      res.json(eleitores);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar eleitores" });
    }
  };

  // Método para buscar um eleitor pela matrícula
  getEleitorByMatricula = async (req: Request, res: Response): Promise<void> => {
    try {
      const matricula = req.params.matricula; // Usando 'matricula'
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

  // Método para criar um eleitor
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

  // Método para atualizar um eleitor com base na matrícula
  updateEleitor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { matricula, nome, patente, status } = req.body;
      await this.eleitorService.updateEleitorByMatricula(
        matricula,
        nome,
        patente,
        status
      );
      res.status(204).send(); // Sucesso, mas sem conteúdo
    } catch (error) {
      next(error);
    }
  };

  // Método para deletar um eleitor
  deleteEleitor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const matricula = req.params.matricula; // Usando 'matricula' para deletar
      await this.eleitorService.deleteEleitor(matricula);
      res.status(204).send(); // Sucesso, mas sem conteúdo
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar eleitor" });
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { matricula, status } = req.body; // O corpo deve incluir matricula e novo status
      await this.eleitorService.updateStatusByMatricula(matricula, status);
      res.status(204).send(); // Sucesso, mas sem conteúdo
    } catch (error) {
      next(error);
    }
  };


}
