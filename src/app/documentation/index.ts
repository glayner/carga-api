import { OpenAPIV3 } from "openapi-types";
import { LoadTestDoc } from "./load-test.doc.js";

const versionApi = process.env.npm_package_version || "1.0.0";
const DocumentationConfig: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "Autocannon API",
    version: versionApi,
    description:
      "Execução de teste de carga por chamada api com cadeia de requisições! Os dados estão sendo salvos em um arquivo local para demonstração, deve-se implementar um banco de dados se der continuidade",
  },
  tags: [
    {
      name: "Teste de Carga",
      description: "Chamadas ao teste de carga",
    },
  ],
  paths: {
    ...LoadTestDoc,
  },
};

export default DocumentationConfig;
