import { AppDataSource } from "./data-source";

export const connectToDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Conexão com o banco de dados estabelecida!");
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
  }
};
