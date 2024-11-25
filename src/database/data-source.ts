import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Eleitor } from "../entities/Eleitor";
import { Presenca } from "../entities/Presenca";
import { Sessao } from "../entities/Sessao";

export const AppDataSource = new DataSource({
  type: "sqlite", // Define o tipo de banco como SQLite
  database: "eleicao_db.sqlite", // Nome do arquivo do banco de dados SQLite
  synchronize: true, // Sincroniza as entidades automaticamente (apenas em desenvolvimento)
  logging: false, // Define o nível de log
  entities: [User, Eleitor, Presenca, Sessao], // Entidades usadas pelo TypeORM
  migrations: ["src/database/migrations/**/*.ts"], // Migrations
  subscribers: [],
});
