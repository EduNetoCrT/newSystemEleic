import { ChapaRepository } from "../repositories/ChapaRepository";

export class ResultadoService {
  private chapaRepository: ChapaRepository;

  constructor(chapaRepository: ChapaRepository) {
    this.chapaRepository = chapaRepository;
  }

  async getResultados(): Promise<any> {
    const chapas = await this.chapaRepository.findAllWithCandidatosAndVotos();

    const resultados = chapas.map((chapa) => {
      const candidatos = chapa.candidatos.map((candidato) => {
        const votosPorSecao = candidato.votos.reduce((acc, voto) => {
          const local = voto.secao.local;
          acc[local] = (acc[local] || 0) + voto.quantidade;
          return acc;
        }, {} as Record<string, number>);

        const total = Object.values(votosPorSecao).reduce(
          (sum, quantidade) => sum + quantidade,
          0
        );

        return {
          id: candidato.id, // Incluímos o ID do candidato
          candidato: candidato.nome,
          funcao: candidato.funcao,
          votosPorSecao,
          total,
        };
      });

      return {
        chapa: chapa.nome,
        candidatos,
      };
    });

    return resultados;
  }
}
