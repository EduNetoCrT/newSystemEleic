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
      const { email, name, password } = req.body;
      const newUser = await this.userService.createUser({
        password,
        email,
        name,
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
}
