import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Chapa } from "./Chapa";
import { Voto } from "./Voto";

@Entity()
export class Candidato {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    funcao: string;

    @ManyToOne(() => Chapa, (chapa) => chapa.candidatos)
    chapa: Chapa;

    @OneToMany(() => Voto, (voto) => voto.candidato)
    votos: Voto[];
}
