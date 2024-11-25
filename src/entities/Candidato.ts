import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { IsNotEmpty, Matches } from "class-validator";
import { Chapa } from "./Chapa";
import { Voto } from "./Voto";
import { Transform } from "class-transformer";

@Entity()
export class Candidato {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: "O nome do candidato é obrigatório." })
  nome: string;

  @Column()
  @IsNotEmpty({ message: "A função do candidato é obrigatória." })
  funcao: string;

  @Column({ nullable: true }) // Permite registros existentes sem valor inicialmente
  @Matches(/^\d{3}\.?\d{3}-?\d{1}$/, {
    message: "A matrícula deve estar no formato 555.555-5 ou 5555555.",
  })
  @Transform(({ value }) =>
    value?.replace(/[^0-9]/g, "").replace(/^(\d{3})(\d{3})(\d{1})$/, "$1.$2-$3")
  )
  matricula?: string;

  @ManyToOne(() => Chapa, (chapa) => chapa.candidatos)
  chapa: Chapa;

  @OneToMany(() => Voto, (voto) => voto.candidato)
  votos: Voto[];
}
