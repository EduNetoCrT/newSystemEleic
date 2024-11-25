import { Router } from "express";
import UserController from "./controllers/UserController";
import { EleitorController } from "./controllers/EleitorController";
import { PresencaController } from "./controllers/PresencaController";
import { SessaoController as SecaoController } from "./controllers/SessaoController";
import AuthController from "./controllers/AuthController"; // Importando o AuthController
import { authMiddleware } from "./middleware/authMiddleware";
import { ChapaController } from "./controllers/ChapaController";
import { VotoController } from "./controllers/VotoController";
import { CandidatoController } from "./controllers/CandidatoController";
import { ResultadoController } from "./controllers/ResultadoController";

export const router = Router();

// Instanciando os controladores
const userController = new UserController();
const eleitorController = new EleitorController();
const presencaController = new PresencaController();
const secaoController = new SecaoController();
const authController = new AuthController(); // Instanciando o AuthController

// Rotas para User
router.get("/users", userController.getAllUsers);
router.post("/users", userController.createUser);
router.delete("/users/:id", userController.deleteUser);

// Rotas para Eleitor
router.get("/eleitores", eleitorController.getAllEleitores);
router.get("/eleitores/:matricula", eleitorController.getEleitorByMatricula);
router.post("/eleitores", eleitorController.createEleitor);
router.put("/eleitores/:matricula", eleitorController.updateEleitor);
router.delete("/eleitores/:matricula", eleitorController.deleteEleitor);
router.put("/eleitores/status", eleitorController.updateStatus);

// Rotas para Presenca
router.get("/presencas", presencaController.getAllPresencas);
router.get("/eleitor/:id", presencaController.buscarEleitorPorMatricula);
router.post("/presencas", presencaController.createPresenca);
router.get(
  "/presencas/contagem-por-sessao",
  presencaController.getPresencaCountBySessao
);

// Rotas para Sessao
router.get("/sessoes", secaoController.getAllSessoes);
router.post("/sessoes", secaoController.createSessao);

// Rota para login
router.post("/login", authController.login); // Adicionando a rota de login
router.get("/profile", authMiddleware, userController.getUserProfile);

// Rotas para Chapas
router.post("/chapas", ChapaController.create);
router.put("/chapas/:chapaId/candidatos", ChapaController.addCandidatos);
router.get("/chapas", ChapaController.getAll);
router.get("/chapas/:id", ChapaController.getById);

// Rotas para Candidato
router.post("/candidatos", CandidatoController.create);
router.get("/candidatos", CandidatoController.getAll);
router.get("/candidatos/:id", CandidatoController.getById);
router.put("/candidatos/:id", CandidatoController.update);
router.delete("/candidatos/:id", CandidatoController.delete);

// Rotas para Votos
router.post("/votos/candidato", VotoController.addVote);
router.post("/votos", VotoController.addVotes);
router.get("/votos/candidato/:candidatoId", VotoController.getVotesByCandidato);

// Rotas para Resultadods
router.get("/resultados", ResultadoController.getResultados);

// Rotas para Sessao
router.get("/secoes", secaoController.getAllSessoes);
router.get("/secoes/:id", secaoController.getSessaoById);
router.post("/secoes", secaoController.createSessao);