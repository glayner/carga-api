import { Router } from "express";
import runnerController from "../controller/runner.controller.js";
import { validateRunnerLoadTest } from "../validations/runner.validations.js";

const runnerRoutes = Router();

runnerRoutes.post(
  "/executar",
  validateRunnerLoadTest,
  runnerController.runLoadTest
);

runnerRoutes.get(
  [
    "/buscar/namespace/:namespace/versao/:versao/cenario/:cenario",
    "/buscar/namespace/:namespace/versao/:versao",
  ],
  runnerController.searchResult
);

export default runnerRoutes;
