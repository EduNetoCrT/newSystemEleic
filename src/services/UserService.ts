import { Repository } from "typeorm";
import { RoleEnum, User } from "../entities/User";
import { hash } from "bcrypt";
import { AppDataSource } from "../database/data-source";
import { ErrorApp } from "../utils/ErrorApp";

type UserRequest = {
  email: string;
  name: string;
  password: string;
};

type UserResponse = {
  id: string;
  email: string;
  name: string;
  role: RoleEnum;
};

export class UserService {
  private userRepository: Repository<User>;
  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async createUser({
    email,
    password,
    name,
  }: UserRequest): Promise<ErrorApp | User> {
    const validationData: Partial<User> = { email, password, name };
    const keys = Object.keys(validationData);
    const emptyFields = keys.filter((key) => !validationData?.[key]);

    if (emptyFields.length) {
      return new ErrorApp({
        message: `Campos obrigatórios: ${emptyFields.join(", ")}`,
        status: 400,
      });
    }

    const existUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existUser) {
      return new ErrorApp({
        message: "Usuário já cadastrado",
        status: 400,
      });
    }

    const passwordHash = await hash(password, 8);

    const user = this.userRepository.create({
      email,
      name,
      password: passwordHash,
      role: RoleEnum.MESARIO,
    });

    await this.userRepository.save(user);

    return user;
  }

  async getAllUsers(): Promise<UserResponse[]> {
    const users = this.userRepository.find();
    const usersWithoutPassword = users.then((users) =>
      users.map(({ password, ...user }) => user)
    );

    return usersWithoutPassword;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  // async updateUser(id: string, name: string, email: string): Promise<User | undefined> {
  //     await this.userRepository.update(id, { name, email })
  //     return this.getUserById(id)
  // }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
