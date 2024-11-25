import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Eleitor } from "../entities/Eleitor";
import { Presenca } from "../entities/Presenca";
import { Sessao } from "../entities/Sessao";
import { Chapa } from "../entities/Chapa";
import { Candidato } from "../entities/Candidato";
import { Voto } from "../entities/Voto";

export const AppDataSource = new DataSource({
  type: "sqlite", 
  database: "eleicao_db.sqlite", 
  synchronize: true, 
  logging: false, 
  entities: [User, Eleitor, Presenca, Sessao, Chapa, Candidato, Voto],
  migrations: ["src/database/migrations/**/*.ts"],
  subscribers: [],
});
