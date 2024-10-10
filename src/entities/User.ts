import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Presenca } from "./Presenca";

export enum RoleEnum {
  ADMIN = "admin",
  MESARIO = "mesario",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
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
    type: "enum",
    enum: RoleEnum,
    default: RoleEnum.MESARIO,
  })
  role!: RoleEnum;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => Presenca, (presenca) => presenca.registradoPor)
  presencasRegistradas!: Presenca[];
}
