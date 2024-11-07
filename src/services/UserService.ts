import { Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../database/data-source";
import { ErrorApp } from "../utils/ErrorApp";
import bcrypt from "bcrypt";

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  // Método para criar um novo usuário
  async createUser(data: { email: string; name: string; password: string; secao: string }): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOne({ where: { email: data.email } });
      if (existingUser) {
        throw new ErrorApp({
          message: "Usuário com este e-mail já existe",
          status: 409,
        });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = this.userRepository.create({ ...data, password: hashedPassword });
      return await this.userRepository.save(user);
    } catch (error) {
      const msg = error.message || "Erro ao criar usuário";
      throw new ErrorApp({ message: msg, status: 400 });
    }
  }

  // Método para obter todos os usuários
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Método para obter um usuário por e-mail
  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  // Método para obter um usuário por ID
  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  // Método para atualizar um usuário
  async updateUser(id: string, data: { name?: string; email?: string; password?: string; secao?: string }): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new ErrorApp({ message: "Usuário não encontrado", status: 404 });
    }

    // Atualiza os dados do usuário
    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email;
    if (data.password) user.password = await bcrypt.hash(data.password, 10); // Atualiza a senha criptografada
    if (data.secao) user.secao = data.secao; // Atualiza a seção

    await this.userRepository.save(user);
    return user;
  }

  // Método para deletar um usuário
  async deleteUser(id: string): Promise<void> {
    const result = await this.userRepository.delete({ id });

    if (result.affected === 0) {
      throw new ErrorApp({ message: "Usuário não encontrado para deletar", status: 404 });
    }
  }
}
