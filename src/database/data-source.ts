import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Eleitor } from "../entities/Eleitor";
import { Presenca } from "../entities/Presenca";
import { Sessao } from "../entities/Sessao";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "admineleicao",
  password: "Senha@edu9125",
  database: "eleicao_teste",
  synchronize: true,
  logging: false,
  entities: [User, Eleitor, Presenca,  Sessao], 
  migrations: ["src/database/migrations/**/*.ts"],
  subscribers: [],
});