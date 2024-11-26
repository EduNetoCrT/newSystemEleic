import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";
import { UserRepository } from "../repositories/UserRepository";
import { SecaoRepository } from "../repositories/SecaoRepository";

// Instâncias dos serviços criadas fora da classe
const userRepository = new UserRepository();
const secaoRepository = new SecaoRepository();
const userService = new UserService(userRepository, secaoRepository);

export default class UserController {
  static async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, name, password, secaoId } = req.body;
      
      const newUser = await userService.createUser({
        password,
        email,
        name,
        secaoId,
      });

      if (!newUser) {
        return next(new Error("Erro ao criar usuário."));
      }

      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      await userService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async getUserProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id, name, secao } = (req as any).user; // Usuário decodificado no token
      res.status(200).json({ id, name, secao });
    } catch (error) {
      next(error);
    }
  }
}
