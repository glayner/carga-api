import { Router } from "express";
import runnerController from "../controller/runner.controller.js";
import {
  validateGetResultRunnerLoadTest,
  validateRunnerLoadTest,
  validateSearchResultRunnerLoadTest,
} from "../validations/runner.validations.js";

const runnerRoutes = Router();

runnerRoutes.post(
  "/executar",
  validateRunnerLoadTest,
  runnerController.runLoadTest
);

runnerRoutes.get(
  [
    "/buscar/:keyReq/namespace/:namespace/versao/:versao/cenario/:cenario",
    "/buscar/:keyReq/namespace/:namespace/versao/:versao",
  ],
  validateGetResultRunnerLoadTest,
  runnerController.getResult
);

runnerRoutes.get(
  "/buscar/",
  validateSearchResultRunnerLoadTest,
  runnerController.searchResult
);

export default runnerRoutes;
