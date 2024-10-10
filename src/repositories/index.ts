import { Repository } from "typeorm";
import { Eleitor, StatusEnum } from "../entities/Eleitor";
import { AppDataSource } from "../database/data-source";
import { ErrorApp } from "../utils/ErrorApp";
import { Presenca } from "../entities/Presenca";

export class EleitorService {
  private eleitorRepository: Repository<Eleitor>;

  constructor() {
    this.eleitorRepository = AppDataSource.getRepository(Eleitor);
  }

  

  // Métodos de criação, busca e atualização...
}

export class PresencaServiceService {
  private presencaRepository: Repository<Presenca>;

  constructor() {
    this.presencaRepository = AppDataSource.getRepository(Presenca);
  }

}
