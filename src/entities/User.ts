// src/entities/User.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Presenca } from "./Presenca";

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

  @Column({
    type: "varchar",
    length: 50, // Ajuste o tamanho conforme necessário
  })
  secao!: string; // Novo campo 'secao'

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => Presenca, (presenca) => presenca.registradoPor)
  presencasRegistradas!: Presenca[];
}
