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

const authenticatedRoutes = Router();
// Aplicar o middleware de autenticação a todas as rotas deste grupo
authenticatedRoutes.use(authMiddleware);

// Instanciando os controladores
const eleitorController = new EleitorController();
const presencaController = new PresencaController();
const secaoController = new SecaoController();
const authController = new AuthController();

// Rota para login
router.post("/login", authController.login); // Adicionando a rota de login

// Rotas para User
authenticatedRoutes.get("/users", UserController.getAllUsers);
authenticatedRoutes.post("/users", UserController.createUser);
authenticatedRoutes.delete("/users/:id", UserController.deleteUser);
authenticatedRoutes.get("/profile", UserController.getUserProfile);

// Rotas para Eleitor
authenticatedRoutes.get("/eleitores", eleitorController.getAllEleitores);
authenticatedRoutes.get("/eleitores/:matricula", eleitorController.getEleitorByMatricula);
authenticatedRoutes.post("/eleitores", eleitorController.createEleitor);
authenticatedRoutes.put("/eleitores/:matricula", eleitorController.updateEleitor);
authenticatedRoutes.delete("/eleitores/:matricula", eleitorController.deleteEleitor);
authenticatedRoutes.put("/eleitores/status", eleitorController.updateStatus);

// Rotas para Presenca
router.get("/presencas", presencaController.getAllPresencas);
router.get(
  "/presencas/contagem-por-sessao",
  presencaController.getPresencaCountBySessao
);
authenticatedRoutes.get("/eleitor/:id", presencaController.buscarEleitorPorMatricula);
authenticatedRoutes.post("/presencas", presencaController.createPresenca);

// Rotas para Sessao
router.get("/sessoes", secaoController.getAllSessoes);
authenticatedRoutes.post("/sessoes", secaoController.createSessao);

// Rotas para Chapas
router.get("/chapas", ChapaController.getAll);
authenticatedRoutes.get("/chapas/:id", ChapaController.getById);
authenticatedRoutes.post("/chapas", ChapaController.create);
authenticatedRoutes.put("/chapas/:chapaId/candidatos", ChapaController.addCandidatos);

// Rotas para Candidato
router.get("/candidatos", CandidatoController.getAll);
router.get("/candidatos/:id", CandidatoController.getById);
authenticatedRoutes.post("/candidatos", CandidatoController.create);
authenticatedRoutes.put("/candidatos/:id", CandidatoController.update);
authenticatedRoutes.delete("/candidatos/:id", CandidatoController.delete);

// Rotas para Votos
authenticatedRoutes.post("/votos/candidato", VotoController.addVote);
authenticatedRoutes.post("/votos", VotoController.addVotes);
router.get("/votos/candidato/:candidatoId", VotoController.getVotesByCandidato);

// Rotas para Resultadods
router.get("/resultados", ResultadoController.getResultados);

// Rotas para Sessao
router.get("/secoes", secaoController.getAllSessoes);
authenticatedRoutes.get("/secoes/:id", secaoController.getSessaoById);
authenticatedRoutes.post("/secoes", secaoController.createSessao);

// Adicionar rotas protegidas ao router principal
router.use(authenticatedRoutes);

