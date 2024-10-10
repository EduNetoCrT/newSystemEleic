import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Presenca } from "./Presenca";

export enum StatusEnum {
  APTO = "APTO",
  INAPTO = "INAPTO",
}

@Entity()
export class Eleitor {
  @PrimaryColumn() // A matrícula será a chave primária
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
    type: "enum",
    enum: StatusEnum,
    default: StatusEnum.APTO,
  })
  status!: StatusEnum;

  @OneToMany(() => Presenca, (presenca) => presenca.eleitor)
  presencas!: Presenca[];
}
