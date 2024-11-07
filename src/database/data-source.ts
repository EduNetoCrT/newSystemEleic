import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Eleitor } from "../entities/Eleitor";
import { Presenca } from "../entities/Presenca";
import { Sessao } from "../entities/Sessao";

const isProduction = process.env.NODE_ENV === "production";

export const AppDataSource = new DataSource({
  type: isProduction ? "postgres" : "sqlite",
  host: isProduction ? "localhost" : undefined,
  port: isProduction ? 5432 : undefined,
  username: isProduction ? "admineleicao" : undefined,
  password: isProduction ? "Senha@edu9125" : undefined,
  database: isProduction ? "eleicao_teste" : "eleicao_dev.sqlite",
  synchronize: true,
  logging: isProduction,
  entities: [User, Eleitor, Presenca, Sessao],
  migrations: ["src/database/migrations/**/*.ts"],
  subscribers: [],
});
