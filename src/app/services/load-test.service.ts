import autocannon, {Request} from "autocannon";
import RespositoryJson from "../../common/database/repository.js";
import { replaceMarkers } from "../../common/utils/variable-replacement.js";
import { EnvType } from "../controller/runner.controller.js";
import { LoadTestExecute } from "../validations/runner.validations.js";


export async function loadTestService(
  data: LoadTestExecute,
  logKey: string,
  initialEnv?: EnvType
) {
  const environment: EnvType = { ...initialEnv };

  let { url, body, headers, method, ...rest } = data;

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

  
  await RespositoryJson.createOrUpdateLoadData({key:logKey, loadData: result,} )


  
}
