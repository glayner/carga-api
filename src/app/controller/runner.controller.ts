import { Request, Response } from "express";
import { getResultService } from "../services/get-result.service.js";
import { loadTestService } from "../services/load-test.service.js";
import { requestEngineService } from "../services/request-engine.service.js";
import { searchResultService } from "../services/search-result.service.js";
import {
  ParamGetResultLoadTest,
  QuerySearchResultLoadTest,
  RequestEngine,
  RunnerLoadTestBody,
} from "../validations/runner.validations.js";

export type EnvType = Record<string, any>;
export type MyCookie = {
  cookie: string;
  oldCookie?: [string[]];
};
class RunnerController {
  async runLoadTest(request: Request, response: Response): Promise<Response> {
    const { posRequest, preRequest, testeDeCarga, namespace, versao, cenario } =
      request.body as RunnerLoadTestBody;

    const sysKey = `${namespace.trim()}-${versao}-${cenario
      ?.split(" ")
      .join("-")
      .trim()}`;
    const reqKey = String(Date.now()).concat("-" + crypto.randomUUID());

    let environment: EnvType = {};
    let cookies: MyCookie = {
      cookie: "",
    };

    if (preRequest && preRequest[0]) {
      const { environment: preReqEnv, cookies: preReqCookies } =
        await requestEngineService({
          requests: preRequest as RequestEngine[],
          sysKey,
          reqKey,
          type: "pre",
          initialCookie: cookies,
          initialEnv: environment,
        });
      environment = preReqEnv;
      cookies = preReqCookies;
    }

    loadTestService({
      loadTest: testeDeCarga,
      initialEnv: environment,
      reqKey,
      sysKey,
    })
      .then(() => {
        if (posRequest && posRequest[0]) {
          requestEngineService({
            requests: posRequest as RequestEngine[],
            sysKey,
            reqKey,
            type: "pos",
            initialEnv: environment,
            initialCookie: cookies,
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

    let routeToResult = `${
      process.env.API_URL || "http://localhost:3000"
    }/teste-carga/buscar/${reqKey}/namespace/${namespace}/versao/${versao}`;

    if (cenario) routeToResult = routeToResult.concat(`/cenario/${cenario}`);

    return response.json({
      message: `Teste de carga em execução, consulte pela rota ${new URL(
        routeToResult
      )}`,
    });
  }

  async searchResult(request: Request, response: Response): Promise<Response> {
    const { antesDe, depoisDe, namespace, versao, cenario } =
      request.query as QuerySearchResultLoadTest;

    const result = await searchResultService({
      namespace,
      version: versao,
      scenario: cenario,
      after: depoisDe ? new Date(depoisDe as string) : undefined,
      before: antesDe ? new Date(antesDe as string) : undefined,
    });
    return response.json(result);
  }

  async getResult(request: Request, response: Response): Promise<Response> {
    const { namespace, versao, cenario, keyReq } =
      request.params as ParamGetResultLoadTest;

    const keySys = `${namespace.trim()}-${versao}-${cenario
      ?.split(" ")
      .join("-")
      .trim()}`;

    const result = await getResultService({ keyReq: keyReq, keySys: keySys });

    return response.json(result);
  }
}

export default new RunnerController();
