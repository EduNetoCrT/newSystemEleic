import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from "typeorm";
import { Candidato } from "./Candidato";
import { Sessao as Secao } from "./Sessao";

@Entity()
export class Voto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantidade: number;

    @ManyToOne(() => Candidato, (candidato) => candidato.votos, { eager: true })
    candidato!: Candidato;
  
    @ManyToOne(() => Secao, (secao) => secao.votos, { eager: true })
    secao!: Secao;
}
