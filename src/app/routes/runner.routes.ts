import { Router } from "express";
import runnerController from "../controller/runner.controller.js";
import { validateGetResultRunnerLoadTest, validateRunnerLoadTest } from "../validations/runner.validations.js";

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
  validateGetResultRunnerLoadTest,
  runnerController.searchResult
);

export default runnerRoutes;
