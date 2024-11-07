// src/controllers/UserController.ts
import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";

export default class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, name, password, secao } = req.body; // Adicionando 'secao'
      const newUser = await this.userService.createUser({
        password,
        email,
        name,
        secao, // Incluindo 'secao'
      });

      if (newUser instanceof Error) {
        return next(newUser);
      }

      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error getAllUsers" });
    }
  };

  // Método para deletar um usuário
  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params; // Obtendo o ID do usuário a partir dos parâmetros da URL
    try {
      await this.userService.deleteUser(id); // Chamando o serviço para deletar o usuário
      res.status(204).send(); // Enviando resposta 204 No Content
    } catch (error) {
      next(error); // Passa o erro para o middleware de tratamento de erros
    }
  };

  getUserProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id, name, secao } = (req as any).user;  // Pegando as informações do token decodificado
      return res.status(200).json({ id, name, secao });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao recuperar perfil do usuário" });
    }
  };

}
