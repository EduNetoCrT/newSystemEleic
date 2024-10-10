import { Router } from "express";
import UserController from "./controllers/UserController"; // Ajuste o caminho conforme necessário
import { EleitorController } from "./controllers/EleitorController";
import { PresencaController } from "./controllers/PresencaController";
import { SessaoController } from "./controllers/SessaoController";


export const router = Router();

//Instanciando os controladores
const userController = new UserController();
const eleitorController = new EleitorController();
const presencaController = new PresencaController();
const sessaoController = new SessaoController();

// Rotas para User
router.get("/users", userController.getAllUsers);
router.post("/users", userController.createUser);
// router.put("/users/:id", userController.updateUser);
// router.delete("/users/:id", userController.deleteUser);
// router.get("/users/:id", userController.getUserById);

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
// router.delete("/presencas/:id", presencaController.deletePresenca);

// Rotas para Sessao
router.get("/sessoes", sessaoController.getAllSessoes);
// router.get("/sessoes/:id", sessaoController.getSessaoById);
 router.post("/sessoes", sessaoController.createSessao);
// router.put("/sessoes/:id", sessaoController.updateSessao);
// router.delete("/sessoes/:id", sessaoController.deleteSessao);


