import { NextFunction, Request, Response } from "express";
import { PresencaService } from "../services/PresencaService";

export class PresencaController {
    private presencaService: PresencaService;

    constructor() {
        this.presencaService = new PresencaService();
    }

    // Retorna todas as presenças com as relações eleitor e sessão
    getAllPresencas = async (req: Request, res: Response): Promise<void> => {
        try {
            const presencas = await this.presencaService.getAllPresencas();
            res.json(presencas);  // Envia as presenças para o frontend
        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar presenças" });
        }
    };

    // Busca uma presença pelo ID
    getPresencaById = async (req: Request, res: Response): Promise<void> => {
        try {
            const presenca = await this.presencaService.getPresencaById(req.params.id);
            if (presenca) {
                res.json(presenca);
            } else {
                res.status(404).json({ message: "Presença não encontrada" });
            }
        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar presença" });
        }
    }

    // Busca eleitor pelo número de matrícula
    buscarEleitorPorMatricula = async (req: Request, res: Response): Promise<void> => {
        try {
            const { matricula } = req.params;
            const eleitor = await this.presencaService.buscarEleitorPorMatricula(matricula);
            res.json(eleitor);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    };

    // Cria uma nova presença utilizando o local da sessão
    createPresenca = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { local, eleitorMatricula } = req.body;
            const newPresenca = await this.presencaService.createPresenca(local, eleitorMatricula);

            // Atualização para incluir o nome da sessão na resposta
            res.status(201).json({
                message: `Presença registrada com sucesso para o eleitor ${eleitorMatricula} na sessão ${newPresenca.sessao.local} - ${newPresenca.sessao.numero} em ${newPresenca.dataPresenca.toISOString()}.`,
                data: {
                    ...newPresenca,
                    sessao: newPresenca.sessao.local, // Retorna o nome da sessão
                },
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    };

    // Remove presença (método desativado, para ser ativado conforme necessário)
    // deletePresenca = async (req: Request, res: Response): Promise<void> => {
    //     try {
    //         await this.presencaService.deletePresenca(req.params.id);
    //         res.status(204).send();
    //     } catch (error) {
    //         res.status(500).json({ message: "Erro ao deletar presença" });
    //     }
    // }
}
