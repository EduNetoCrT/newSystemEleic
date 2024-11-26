import * as bcrypt from "bcrypt";
import { UserRepository } from "../repositories/UserRepository";
import { SecaoRepository } from "../repositories/SecaoRepository";
import { User } from "../entities/User";

export class UserService {
  private userRepository: UserRepository;
  private secaoRepository: SecaoRepository;

  constructor(
    userRepository: UserRepository,
    secaoRepository: SecaoRepository
  ) {
    this.userRepository = userRepository;
    this.secaoRepository = secaoRepository;
  }

  async createUser(data: Partial<User> & {secaoId: string}): Promise<User> {
    const {
      name,
      email,
      password,
      secaoId
    } = data;

    if (!name || !email || !password || !secaoId) {
      throw new Error("Todos os campos obrigatórios devem ser preenchidos.");
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("E-mail já está em uso.");
    }

    const secao = await this.secaoRepository.findById(secaoId);
    if (!secao) {
      throw new Error("Seção não encontrada.");
    }

    // Atualiza os dados do usuário
    const passwordHashed = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      name,
      email,
      password: passwordHashed,
      secao,
    });

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }
    await this.userRepository.delete(id);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
}
