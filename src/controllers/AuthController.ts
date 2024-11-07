import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export default class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const { email, password } = req.body;
      const user = await this.authService.authenticate(email, password);

      if (!user) {
        return res.status(401).json({ message: "Email ou senha incorretos" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, secao: user.secao },  // Incluindo name e secao
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );

      return res.status(200).json({ message: "Login bem-sucedido", token });
    } catch (error) {
      next(error);
      return res.status(500).json({ message: "Erro ao fazer login" });
    }
  };
}
