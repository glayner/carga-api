import jsonpath from "jsonpath";
import RespositoryJson from "../../common/database/repository.js";
import { replaceMarkers } from "../../common/utils/variable-replacement.js";
import { EnvType } from "../controller/runner.controller.js";
import { RequestEngine } from "../validations/runner.validations.js";
import AppError from "../../common/errors/app-error.js";

interface ExecuteRequestEngine {
  requests: RequestEngine[];
  logKey: string;
  type: "pre" | "pos";
  initialEnv?: EnvType;
}



export async function requestEngineService({
  requests,
  logKey,
  type,
  initialEnv,
}: ExecuteRequestEngine): Promise<EnvType> {
  const environment: EnvType = {
    ...initialEnv,
  };

  const listOfResult: any[] = []
  const listOfError: any[] = []

 async function createLog(){
    await RespositoryJson.createOrUpdateRequest({
      key: logKey,
      type,
      data: {
        variaveis: environment,
        resultados: listOfResult,
      },
      error: {
        erros: listOfError
      }
    });
  }

  for (const [index, request] of requests.entries()) {
    let { url, method, headers, body } = request.request;

    url = replaceMarkers(url, environment);
    headers = replaceMarkers(headers, environment);
    const parsedJsonBody = body
      ? JSON.stringify(replaceMarkers(body, environment))
      : undefined;

    const data = await fetch(url, {
      method,
      headers,
      body: parsedJsonBody,
    })
      .then(async (res) => {
        const dataToLog = {
          status: res.status,
          headers: headers,
          body: parsedJsonBody,
          statusText: res.statusText,
          url,
          method,
          date: new Date().toLocaleString('pt-BR')
        }

        if (!res.ok) {
          const message = `Error in ${
            index + 1
          }º in ${type} request for url: ${url} status ${res.status} - ${
            res.statusText
          }!`;
          listOfError.push({
            ...dataToLog,
            message
          })
          throw new AppError( `${type === 'pre' ? 1 : 3}${String(index).padStart(2,'0')}`, message, dataToLog );
        };

        const resultData= res.json().catch(() => res.text().catch(() => {message:'não foi possível recuperar o corpo da resposta'}))

        listOfResult.push({
          ...dataToLog,
          data: resultData,
        })

        return resultData;
      }).catch(async e=>{
        await createLog()
        throw e
      })

    if (request.environment) {
      for (const env of request.environment) {
        environment[env.nome] = jsonpath.query(data, env.campo)[0];
      }
    }
  }

  await createLog()
  return environment;
}