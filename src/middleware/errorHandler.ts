import { Request, Response, NextFunction } from 'express';
import { ErrorApp } from '../utils/ErrorApp';

export const errorHandler = (
  err: Error | ErrorApp,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof ErrorApp) {
    return res.status(err.status).json(err.toJSON());
  }

  // Se não for um ErrorApp, assumimos que é um erro 500 - Internal Server Error
  return res.status(500).json({
    name: 'InternalServerError',
    message: 'Erro interno do servidor',
    status: 500
  });
};