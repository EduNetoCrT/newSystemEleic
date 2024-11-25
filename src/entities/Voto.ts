import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Candidato } from "./Candidato";
import { Sessao as Secao } from "./Sessao";

@Entity()
export class Voto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantidade: number;

    @ManyToOne(() => Candidato, (candidato) => candidato.votos)
    candidato: Candidato;

    @ManyToOne(() => Secao, (secao) => secao.presencas, { eager: true }) // Carrega automaticamente a seção
    secao!: Secao;
}
