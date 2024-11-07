import { Repository } from "typeorm";
import { Eleitor, StatusEnum } from "../entities/Eleitor";
import { AppDataSource } from "../database/data-source";
import { ErrorApp } from "../utils/ErrorApp";
import { Not } from "typeorm";

export class EleitorService {
  private eleitorRepository: Repository<Eleitor>;

  constructor() {
    this.eleitorRepository = AppDataSource.getRepository(Eleitor);
  }

  // Método para buscar todos os eleitores
  async getAllEleitores(): Promise<Eleitor[]> {
    return this.eleitorRepository.find();
  }

  // Método para buscar um eleitor pela matrícula
  async getEleitorByMatricula(matricula: string): Promise<Eleitor | null> {
    return this.eleitorRepository.findOne({ where: { matricula } });
  }

  // Método para criar um novo eleitor
  async createEleitor(
    matricula: string,
    nome: string,
    cpf: string,
    patente: string,
    status: StatusEnum
    
  ): Promise<Eleitor> {
    try {
      // Verifica se já existe um eleitor com a mesma matrícula
      const existingEleitor = await this.eleitorRepository.findOne({ where: { matricula } });
      if (existingEleitor) {
        throw new ErrorApp({
          message: "Eleitor com esta matrícula já existe",
          status: 409,
        });
      }

      const eleitor = this.eleitorRepository.create({
        matricula,
        nome,
        cpf,
        patente,
        status,
      });
      return await this.eleitorRepository.save(eleitor);
    } catch (error) {
      const msg = error.message || "Erro ao criar eleitor";
      throw new ErrorApp({
        message: msg,
        status: 400,
      });
    }
  }

  // Método para atualizar os dados do eleitor com base na matrícula
  async updateEleitorByMatricula(
    matricula: string,
    nome: string,
    patente: string,
    status: StatusEnum
  ): Promise<void> {
    const eleitor = await this.eleitorRepository.findOne({ where: { matricula } });

    if (!eleitor) {
      throw new ErrorApp({
        message: "Eleitor não encontrado",
        status: 404,
      });
    }

    // Atualiza os dados do eleitor
    eleitor.nome = nome;
    eleitor.patente = patente;
    eleitor.status = status;

    await this.eleitorRepository.save(eleitor);
  }

  // Método para deletar um eleitor
  async deleteEleitor(matricula: string): Promise<void> {
    const result = await this.eleitorRepository.delete({ matricula });

    if (result.affected === 0) {
      throw new ErrorApp({
        message: "Eleitor não encontrado para deletar",
        status: 404,
      });
    }
  }

  async updateStatusByMatricula(
    matricula: string,
    status: StatusEnum
  ): Promise<void> {
    const eleitor = await this.eleitorRepository.findOne({ where: { matricula } });
  
    if (!eleitor) {
      throw new ErrorApp({
        message: "Eleitor não encontrado",
        status: 404,
      });
    }
  
    // Atualiza apenas o status do eleitor
    eleitor.status = status;
    await this.eleitorRepository.save(eleitor);
  }

 
}
