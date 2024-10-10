import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Presenca } from "./Presenca";

@Entity()
export class Sessao {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  local!: string;

  @Column()
  numero!: string;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => Presenca, presenca => presenca.sessao)
  presencas!: Presenca[];
}
