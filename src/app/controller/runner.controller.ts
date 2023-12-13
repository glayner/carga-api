import { Request, Response } from "express";
import {
  LoadTestExecute,
  RequestEngine,
  RunnerLoadTestBody,
} from "../validations/runner.validations.js";
import { requestEngineService } from "../services/request-engine.service.js";
import { loadTestService } from "../services/load-test.service.js";
import { getResultService } from "../services/get-result.service.js";

export type EnvType = Record<string, any>;

interface RunDTO {
  loadTest: LoadTestExecute;
  logKey: string;
  environment: EnvType;
  posRequest: (RequestEngine | undefined)[];
}

class RunnerController {
  private createLogKey(namespace: string, versao: string, cenario?: string) {
    return `${namespace.trim()}-${versao}-${cenario
      ?.split(" ")
      .join("-")
      .trim()}`;
  }

  async runLoadTest(request: Request, response: Response): Promise<Response> {
    const {
      "pos-request": posRequest,
      "pre-request": preRequest,
      "request-carga": loadTest,
      namespace,
      versao,
      cenario,
    } = request.body as RunnerLoadTestBody;

    const logKey = this.createLogKey(namespace, versao, cenario);

    let environment: EnvType = {};

    if (preRequest && preRequest[0]) {
      const preRequestEnv = await requestEngineService({
        requests: preRequest as RequestEngine[],
        logKey: logKey,
        type: "pre",
      });
      environment = {
        ...environment,
        ...preRequestEnv,
      };
    }

    loadTestService(loadTest, logKey, environment)
      .then(() => {
        if (posRequest && posRequest[0]) {
          requestEngineService({
            requests: posRequest as RequestEngine[],
            logKey: logKey,
            type: "pos",
          }).catch((e) => {
            console.error(
              "\n-------------requestEngineService-----------\n",
              e
            );
          });
        }
      })
      .catch((e) => {
        console.error("\n-------------loadTestService-----------\n", e);
      });

    return response.json({
      message:
        "Teste de carga em execução, consulte pela rota /namespace/versao/cenario",
    });
  }

  async searchResult(request: Request, response: Response): Promise<Response> {
    const { namespace, versao, cenario } = request.params;
    
    const logKey = this.createLogKey(namespace, versao, cenario);

    const result = await getResultService({ key: logKey });
    return response.json(result);
  }
}

export default new RunnerController();
