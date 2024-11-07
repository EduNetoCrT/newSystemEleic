import { Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../database/data-source";
import bcrypt from "bcrypt";

export class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  // Método para autenticar o usuário
  async authenticate(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
}
