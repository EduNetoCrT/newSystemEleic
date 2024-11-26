import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Presenca } from "./Presenca";
import { User } from "./User";
import { Voto } from "./Voto";

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

  @OneToMany(() => User, (user) => user.secao)
  users!: User[];

  // Relacionamento com Voto
  @OneToMany(() => Voto, (voto) => voto.secao)
  votos!: Voto[];
}
