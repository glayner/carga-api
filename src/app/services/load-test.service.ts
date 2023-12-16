import autocannon, { Request } from "autocannon";
import RespositoryJson from "../../common/database/repository.js";
import { replaceMarkers } from "../../common/utils/variable-replacement.js";
import { EnvType } from "../controller/runner.controller.js";
import { LoadTestExecute } from "../validations/runner.validations.js";

interface ILoadTestDTO {
  loadTest: LoadTestExecute;
  sysKey: string;
  reqKey: string;
  initialEnv?: EnvType;
}
export async function loadTestService({
  loadTest,
  reqKey,
  sysKey,
  initialEnv,
}: ILoadTestDTO) {
  const environment: EnvType = { ...initialEnv };

  let { url, body, headers, method, ...rest } = loadTest;

  url = replaceMarkers(url, environment);
  headers = replaceMarkers(headers, environment);
  body = replaceMarkers(body, environment);

  const result = await autocannon({
    method: method as Request["method"],
    url,
    body: JSON.stringify(body),
    headers,
    ...rest,
  });

  await RespositoryJson.createOrUpdateLoadData({
    key: sysKey,
    loadData: {...result, key: reqKey},
  });
}
