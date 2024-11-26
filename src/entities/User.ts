// src/entities/User.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Presenca } from "./Presenca";
import { Sessao as Secao } from "./Sessao";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({
    type: "varchar",
    length: 100,
  })
  name!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @Column()
  password!: string;

  @ManyToOne(() => Secao, (secao) => secao.users, { eager: true })
  secao!: Secao;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => Presenca, (presenca) => presenca.registradoPor)
  presencasRegistradas!: Presenca[];
}
