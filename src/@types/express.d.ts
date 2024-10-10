// express.d.ts
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      userId: string; // Adicione a propriedade userId
    }
  }
}
