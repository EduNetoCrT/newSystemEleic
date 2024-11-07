// src/entities/Eleitor.ts

import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Presenca } from "./Presenca";

export enum StatusEnum {
  APTO = "APTO",
  INAPTO = "INAPTO",
}

@Entity()
export class Eleitor {
  @PrimaryGeneratedColumn() // ID com incremento automático
  id!: number;

  @Column() // A matrícula permanece como chave primária
  matricula!: string;

  @Column()
  nome!: string;

  @Column({
    unique: true,
  })
  cpf!: string;

  @Column()
  patente!: string;

  @Column({
    type: "text",
    default: StatusEnum.APTO,
  })
  status!: StatusEnum;

  @Column({ default: false })
  votou!: boolean;

  @OneToMany(() => Presenca, (presenca) => presenca.eleitor)
  presencas!: Presenca[];
}
