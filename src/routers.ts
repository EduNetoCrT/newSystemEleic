import { Router } from "express";
import UserController from "./controllers/UserController";
import { EleitorController } from "./controllers/EleitorController";
import { PresencaController } from "./controllers/PresencaController";
import { SessaoController } from "./controllers/SessaoController";
import AuthController from "./controllers/AuthController"; // Importando o AuthController
import { authMiddleware } from "./middleware/authMiddleware";

export const router = Router();

// Instanciando os controladores
const userController = new UserController();
const eleitorController = new EleitorController();
const presencaController = new PresencaController();
const sessaoController = new SessaoController();
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

// Rotas para Sessao
router.get("/sessoes", sessaoController.getAllSessoes);
router.post("/sessoes", sessaoController.createSessao);

// Rota para login
router.post("/login", authController.login); // Adicionando a rota de login
router.get("/profile", authMiddleware, userController.getUserProfile);

