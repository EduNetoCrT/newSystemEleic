import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Candidato } from "./Candidato";

@Entity()
export class Chapa {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @OneToMany(() => Candidato, (candidato) => candidato.chapa)
    candidatos: Candidato[];
}
