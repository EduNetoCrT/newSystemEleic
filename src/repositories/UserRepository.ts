import { Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../database/data-source";

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async findById(id: string): Promise<User | null> {
    // Busca o usuário pelo ID com relações (se necessário)
    return this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    // Busca todos os usuários
    return this.repository.find();
  }

  async create(data: Partial<User>): Promise<User> {
    // Cria um novo usuário no banco de dados
    const user = this.repository.create(data);
    return this.repository.save(user);
  }

  async delete(id: string): Promise<void> {
    // Remove o usuário pelo ID
    await this.repository.delete(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    // Busca um usuário pelo e-mail
    return this.repository.findOne({ where: { email } });
  }
}
