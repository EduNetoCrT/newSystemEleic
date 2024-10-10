import { SessaoService } from "../services/SessaoService";
import { Request, Response } from "express";

export class SessaoController {
    private sessaoService: SessaoService;

    constructor() {
        this.sessaoService = new SessaoService();
    }

    getAllSessoes = async (req: Request, res: Response): Promise<void> => {
        try {
            const sessoes = await this.sessaoService.getAllSessoes();
            res.json(sessoes);
        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar sessões" });
        }
    }

    // getSessaoById = async (req: Request, res: Response): Promise<void> => {
    //     try {
    //         const sessao = await this.sessaoService.getSessaoById(req.params.id);
    //         if (sessao) {
    //             res.json(sessao);
    //         } else {
    //             res.status(404).json({ message: "Sessão não encontrada" });
    //         }
    //     } catch (error) {
    //         res.status(500).json({ message: "Erro ao buscar sessão" });
    //     }
    // }

    createSessao = async (req: Request, res: Response): Promise<void> => {
        try {
            const { local, numero } = req.body;
            const newSessao = await this.sessaoService.createSessao(local, numero);
            res.status(201).json(newSessao);
        } catch (error) {
            res.status(500).json({ message: "Erro ao criar sessão" });
        }
    }

    // updateSessao = async (req: Request, res: Response): Promise<void> => {
    //     try {
    //         const { nome, data } = req.body;
    //         const updatedSessao = await this.sessaoService.updateSessao(req.params.id, nome, new Date(data));
    //         if (updatedSessao) {
    //             res.json(updatedSessao);
    //         } else {
    //             res.status(404).json({ message: "Sessão não encontrada" });
    //         }
    //     } catch (error) {
    //         res.status(500).json({ message: "Erro ao atualizar sessão" });
    //     }
    // }

    // deleteSessao = async (req: Request, res: Response): Promise<void> => {
    //     try {
    //         await this.sessaoService.deleteSessao(req.params.id);
    //         res.status(204).send();
    //     } catch (error) {
    //         res.status(500).json({ message: "Erro ao deletar sessão" });
    //     }
    // }
}