import 'reflect-metadata';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { connectToDatabase } from './database';
import { env } from 'process';
import { errorHandler } from './middleware/errorHandler';
import { router } from './routers';

dotenv.config();

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middlewares
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Registro das rotas
app.use(router);

// Middleware para tratamento de erros
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectToDatabase();

    const PORT = env.SERVER_PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server", error);
    process.exit(1);
  }
};

startServer();
