import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Acesso negado. Token ausente." });
  }

  const token = authHeader.split(" ")[1]; // Obtém o token do header

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!); // Decodifica o token
    (req as any).user = decoded; // Anexa os dados decodificados ao objeto `req`
    next(); // Continua para o próximo middleware ou rota
  } catch (error) {
    return res.status(403).json({ message: "Token inválido." });
  }
};
