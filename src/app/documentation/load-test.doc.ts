import { OpenAPIV3 } from "openapi-types";
import { RunnerAutocannonSchema } from "../validations/runner.validations.js";
import { generateSchema } from "@anatine/zod-openapi";

const runLoadTestSchema = generateSchema(
  RunnerAutocannonSchema
) as OpenAPIV3.SchemaObject;

const getResultParamsPath: OpenAPIV3.ParameterObject[] = [
  {
    name: "keyReq",
    description: "chave da requisição",
    in: "path",
    required: true,
    style: "simple",
    schema: {
      type: "string",
    },
  },
  {
    name: "namespace",
    description: "namespace da aplicação",
    in: "path",
    required: true,
    style: "simple",
    schema: {
      type: "string",
    },
  },
  {
    name: "versao",
    description: "versão da aplicação no momento do teste",
    in: "path",
    required: true,
    style: "simple",
    schema: {
      type: "string",
    },
  },
];

const getResultResponse: OpenAPIV3.ResponsesObject = {
  "200": {
    description: "ok",
    content: {
      "application/json": {
        example: {
          loadData: [
            {
              title: "execução de exemplo",
              url: "http://api-exemplo.ath.servicos.bb.com.br/test/soma",
              connections: 1,
              sampleInt: 1000,
              pipelining: 1,
              duration: 1.01,
              samples: 1,
              start: "2023-12-14T17:21:20.911Z",
              finish: "2023-12-14T17:21:21.916Z",
              errors: 0,
              timeouts: 0,
              mismatches: 0,
              non2xx: 0,
              resets: 0,
              "1xx": 0,
              "2xx": 5,
              "3xx": 0,
              "4xx": 0,
              "5xx": 0,
              statusCodeStats: {
                "200": {
                  count: 5,
                },
              },
              latency: {
                average: 3,
                mean: 3,
                stddev: 3.58,
                min: 1,
                max: 10,
                p0_001: 0,
                p0_01: 0,
                p0_1: 0,
                p1: 0,
                p2_5: 0,
                p10: 0,
                p25: 1,
                p50: 2,
                p75: 2,
                p90: 10,
                p97_5: 10,
                p99: 10,
                p99_9: 10,
                p99_99: 10,
                p99_999: 10,
                totalCount: 5,
              },
              requests: {
                average: 5,
                mean: 5,
                stddev: 0,
                min: 5,
                max: 5,
                total: 5,
                p0_001: 5,
                p0_01: 5,
                p0_1: 5,
                p1: 5,
                p2_5: 5,
                p10: 5,
                p25: 5,
                p50: 5,
                p75: 5,
                p90: 5,
                p97_5: 5,
                p99: 5,
                p99_9: 5,
                p99_99: 5,
                p99_999: 5,
                sent: 5,
              },
              throughput: {
                average: 4606,
                mean: 4606,
                stddev: 0,
                min: 4605,
                max: 4605,
                total: 4605,
                p0_001: 4607,
                p0_01: 4607,
                p0_1: 4607,
                p1: 4607,
                p2_5: 4607,
                p10: 4607,
                p25: 4607,
                p50: 4607,
                p75: 4607,
                p90: 4607,
                p97_5: 4607,
                p99: 4607,
                p99_9: 4607,
                p99_99: 4607,
                p99_999: 4607,
              },
              key: "1702574480867-de85057c-46b3-4ba0-a99f-1a4492ffe032",
            },
          ],
          preRequest: {
            data: [
              {
                key: "1702574480867-de85057c-46b3-4ba0-a99f-1a4492ffe032",
                date: "2023-12-14T17:21:20.909Z",
                variaveis: {
                  number1: 50,
                  number2: 30,
                },
                resultados: [
                  {
                    status: 200,
                    headers: {
                      "content-type": "application/json",
                      Cookie: "",
                    },
                    statusText: "OK",
                    url: "http://api-exemplo.ath.servicos.bb.com.br/test/parametro1",
                    method: "GET",
                    data: {
                      numero1: 50,
                    },
                    date: "2023-12-14T17:21:20.904Z",
                  },
                  {
                    status: 200,
                    headers: {
                      "content-type": "application/json",
                      Cookie: "",
                    },
                    statusText: "OK",
                    url: "http://api-exemplo.ath.servicos.bb.com.br/test/parametro2",
                    method: "GET",
                    data: {
                      numero2: 30,
                    },
                    date: "2023-12-14T17:21:20.908Z",
                  },
                ],
              },
            ],
            error: [],
          },
          posRequest: {
            data: [
              {
                key: "1702574480867-de85057c-46b3-4ba0-a99f-1a4492ffe032",
                date: "2023-12-14T17:21:21.923Z",
                variaveis: {
                  number1: 50,
                  number2: 30,
                },
                resultados: [
                  {
                    status: 200,
                    headers: {
                      "content-type": "application/json",
                      Cookie: "",
                    },
                    statusText: "OK",
                    url: "http://api-exemplo.ath.servicos.bb.com.br/test/parametro1",
                    method: "GET",
                    data: {
                      numero1: 50,
                    },
                    date: "2023-12-14T17:21:21.923Z",
                  },
                ],
              },
            ],
            error: [],
          },
        },
      },
    },
  },
};

export const LoadTestDoc: OpenAPIV3.PathsObject = {
  "/teste-carga/executar": {
    post: {
      summary: "Executa teste de carga com autocannon",
      description:
        "Faz os testes de carga com autocannon podendo realizar execuções via fetch pré e pós teste de carga",
      tags: ["Teste de Carga"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: runLoadTestSchema,
            examples: {
              full: {
                value: {
                  preRequest: [
                    {
                      request: {
                        url: "http://api-exemplo.ath.servicos.bb.com.br/test/parametro1",
                        method: "GET",
                        headers: {
                          "content-type": "application/json",
                        },
                      },
                      environment: [
                        {
                          nome: "number1",
                          campo: "$.numero1",
                        },
                      ],
                    },
                    {
                      request: {
                        url: "http://api-exemplo.ath.servicos.bb.com.br/test/parametro2",
                        method: "GET",
                        headers: {
                          "content-type": "application/json",
                        },
                      },
                      environment: [
                        {
                          nome: "number2",
                          campo: "$.numero2",
                        },
                      ],
                    },
                  ],
                  testeDeCarga: {
                    url: "http://api-exemplo.ath.servicos.bb.com.br/test/soma",
                    connections: 500,
                    pipelining: 1,
                    duration: 30,
                    method: "POST",
                    title: "execução de exemplo",
                    body: {
                      numero1: "<<number1>>",
                      numero2: "<<number2>>",
                    },
                    headers: {
                      "content-type": "application/json",
                    },
                  },
                  posRequest: [
                    {
                      request: {
                        url: "http://api-exemplo.ath.servicos.bb.com.br/test/parametro1",
                        method: "GET",
                        headers: {
                          "content-type": "application/json",
                        },
                      },
                    },
                  ],
                  namespace: "ath-api-exemplo",
                  versao: "1.0.0-alpha2",
                  cenario: "teste api",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "ok",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example:
                      "Teste de carga em execução, consulte pela rota https://autocannon-api.ath.servicos.bb.com.br/teste-carga/buscar/1702571556624-44c66243-aa99-4387-9130-dba6b04f3553",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/teste-carga/buscar/:keyReq/namespace/:namespace/versao/:versao/cenario/:cenario":
    {
      get: {
        summary: "Busca o resultado do teste de carga",
        description: "Busca os dados salvos da execução do teste de carga",
        tags: ["Teste de Carga"],
        parameters: [
          ...getResultParamsPath,
          {
            name: "cenario",
            description: "cenario do teste",
            in: "path",
            required: true,
            style: "simple",
            schema: {
              type: "string",
            },
          },
        ],
        responses: getResultResponse,
      },
    },
  "/teste-carga/buscar/:keyReq/namespace/:namespace/versao/:versao": {
    get: {
      summary: "Busca o resultado do teste de carga",
      description:
        "Busca os dados salvos da execução do teste de carga (que não informou o cenário no momento da requisição)",
      tags: ["Teste de Carga"],
      parameters: getResultParamsPath,
      responses: getResultResponse,
    },
  },
  "/teste-carga/buscar": {
    get: {
      summary: "Lista o resultado dos testes de carga com filtragem",
      description: "Lista todos os testes de carga ja feitos podendo filtrar",
      tags: ["Teste de Carga"],
      parameters: [
        {
          name: "namespace",
          description: "namespace da aplicação",
          in: "query",
          required: false,
          style: "simple",
          schema: {
            type: "string",
          },
        },
        {
          name: "versao",
          description: "versão da aplicação no momento do teste",
          in: "query",
          required: false,
          style: "simple",
          schema: {
            type: "string",
          },
        },
        {
          name: "cenario",
          description: "cenario do teste",
          in: "query",
          required: false,
          style: "simple",
          schema: {
            type: "string",
          },
        },
        {
          name: "antesDe",
          description: "filtragem testes executados antes do valor informado",
          in: "query",
          required: false,
          style: "simple",
          schema: {
            type: "string",
            format: "date",
          },
        },
        {
          name: "depoisDe",
          description: "filtragem testes executados depois do valor informado",
          in: "query",
          required: false,
          style: "simple",
          schema: {
            type: "string",
            format: "date",
          },
        },
      ],
      responses: {
        "200": {
          description: "ok",
          content: {
            "application/json": {
              example: [
                {
                  key: "ath-api-exemplo-1.0.0-alpha2-teste-api",
                  loadData: [
                    {
                      title: "execução de exemplo",
                      url: "http://api-exemplo.ath.servicos.bb.com.br/test/soma",
                      connections: 1,
                      sampleInt: 1000,
                      pipelining: 1,
                      duration: 1,
                      samples: 1,
                      start: "2023-12-14T17:32:55.277Z",
                      finish: "2023-12-14T17:32:56.281Z",
                      errors: 0,
                      timeouts: 0,
                      mismatches: 0,
                      non2xx: 0,
                      resets: 0,
                      "1xx": 0,
                      "2xx": 5,
                      "3xx": 0,
                      "4xx": 0,
                      "5xx": 0,
                      statusCodeStats: {
                        "200": {
                          count: 5,
                        },
                      },
                      latency: {
                        average: 2.8,
                        mean: 2.8,
                        stddev: 2.49,
                        min: 1,
                        max: 7,
                        p0_001: 0,
                        p0_01: 0,
                        p0_1: 0,
                        p1: 0,
                        p2_5: 0,
                        p10: 0,
                        p25: 1,
                        p50: 2,
                        p75: 4,
                        p90: 7,
                        p97_5: 7,
                        p99: 7,
                        p99_9: 7,
                        p99_99: 7,
                        p99_999: 7,
                        totalCount: 5,
                      },
                      requests: {
                        average: 5,
                        mean: 5,
                        stddev: 0,
                        min: 5,
                        max: 5,
                        total: 5,
                        p0_001: 5,
                        p0_01: 5,
                        p0_1: 5,
                        p1: 5,
                        p2_5: 5,
                        p10: 5,
                        p25: 5,
                        p50: 5,
                        p75: 5,
                        p90: 5,
                        p97_5: 5,
                        p99: 5,
                        p99_9: 5,
                        p99_99: 5,
                        p99_999: 5,
                        sent: 5,
                      },
                      throughput: {
                        average: 4606,
                        mean: 4606,
                        stddev: 0,
                        min: 4605,
                        max: 4605,
                        total: 4605,
                        p0_001: 4607,
                        p0_01: 4607,
                        p0_1: 4607,
                        p1: 4607,
                        p2_5: 4607,
                        p10: 4607,
                        p25: 4607,
                        p50: 4607,
                        p75: 4607,
                        p90: 4607,
                        p97_5: 4607,
                        p99: 4607,
                        p99_9: 4607,
                        p99_99: 4607,
                        p99_999: 4607,
                      },
                      key: "1702575175229-e5771473-fb9d-4f81-9d3a-a9eae5320add",
                    },
                  ],
                  posRequest: {
                    data: [
                      {
                        key: "1702575175229-e5771473-fb9d-4f81-9d3a-a9eae5320add",
                        date: "2023-12-14T17:32:56.288Z",
                        variaveis: {
                          number1: 50,
                          number2: 30,
                        },
                        resultados: [
                          {
                            status: 200,
                            headers: {
                              "content-type": "application/json",
                              Cookie: "",
                            },
                            statusText: "OK",
                            url: "http://api-exemplo.ath.servicos.bb.com.br/test/parametro1",
                            method: "GET",
                            data: {
                              numero1: 50,
                            },
                            date: "2023-12-14T17:32:56.287Z",
                          },
                        ],
                      },
                    ],
                    error: [],
                  },
                  preRequest: {
                    data: [
                      {
                        key: "1702575175229-e5771473-fb9d-4f81-9d3a-a9eae5320add",
                        date: "2023-12-14T17:32:55.275Z",
                        variaveis: {
                          number1: 50,
                          number2: 30,
                        },
                        resultados: [
                          {
                            status: 200,
                            headers: {
                              "content-type": "application/json",
                              Cookie: "",
                            },
                            statusText: "OK",
                            url: "http://api-exemplo.ath.servicos.bb.com.br/test/parametro1",
                            method: "GET",
                            data: {
                              numero1: 50,
                            },
                            date: "2023-12-14T17:32:55.269Z",
                          },
                          {
                            status: 200,
                            headers: {
                              "content-type": "application/json",
                              Cookie: "",
                            },
                            statusText: "OK",
                            url: "http://api-exemplo.ath.servicos.bb.com.br/test/parametro2",
                            method: "GET",
                            data: {
                              numero2: 30,
                            },
                            date: "2023-12-14T17:32:55.274Z",
                          },
                        ],
                      },
                    ],
                    error: [],
                  },
                },
              ],
            },
          },
        },
      },
    },
  },
};
