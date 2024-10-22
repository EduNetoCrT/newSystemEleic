import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn,Column } from "typeorm";
import { Eleitor } from "./Eleitor";
import { Sessao } from "./Sessao";
import { User } from "./User";

@Entity()
export class Presenca {
  @PrimaryGeneratedColumn()
  id!: string;

  @ManyToOne(() => User, user => user.presencasRegistradas)
  registradoPor!: User;

  @ManyToOne(() => Eleitor, eleitor => eleitor.presencas)
  eleitor!: Eleitor;

  @ManyToOne(() => Sessao, sessao => sessao.presencas)
  sessao!: Sessao;

  @CreateDateColumn()
  created_at!: Date;

  @Column()
  dataPresenca!: Date
}
