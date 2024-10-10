import {  Repository } from "typeorm";
import { Sessao } from "../entities/Sessao";
import { AppDataSource } from "../database/data-source";

export class SessaoService {
    private sessaoRepository: Repository<Sessao>;

    constructor() {
        this.sessaoRepository = AppDataSource.getRepository(Sessao);
    }

    async getAllSessoes(): Promise<Sessao[]> {
        return this.sessaoRepository.find();
    }

    // async getSessaoById(id: string): Promise<Sessao | null> {
    //     return this.sessaoRepository.findOne({ where: { id } });
    // }

    async createSessao(local: string, numero: string): Promise<Sessao> {
        const sessao = this.sessaoRepository.create({ local, numero });
        return this.sessaoRepository.save(sessao);
    }

    // async updateSessao(id: string, nome: string, data: Date): Promise<Sessao | null> {
    //     await this.sessaoRepository.update(id, { nome, data });
    //     return this.getSessaoById(id);
    // }
}