import RespositoryJson from "../../common/database/repository.js";
import AppError from "../../common/errors/app-error.js";
interface GetResultServiceDTO {
  keySys: string;
  keyReq: string;
}

export async function getResultService({
  keySys,
  keyReq,
}: GetResultServiceDTO) {
  const result = await RespositoryJson.readLoadTestByKey(keySys);
  if (!result) {
    throw new AppError("404", "não existe dados desse cenario");
  }

  const loadData = result.loadData
    .map((l) => {
      if (l.key === keyReq) {
        return l;
      }
    })
    .filter(Boolean);
  const preRequestData = result.preRequest.data
    .map((pd) => {
      if (pd.key === keyReq) {
        return pd;
      }
    })
    .filter(Boolean);
  const preRequestErr = result.preRequest.error
    .map((pe) => {
      if (pe.key === keyReq) {
        return pe;
      }
    })
    .filter(Boolean);
  const posRequestData = result.posRequest.data
    .map((pd) => {
      if (pd.key === keyReq) {
        return pd;
      }
    })
    .filter(Boolean);
  const posRequestErr = result.posRequest.error
    .map((pe) => {
      if (pe.key === keyReq) {
        return pe;
      }
    })
    .filter(Boolean);

  if (
    !loadData[0] &&
    !preRequestData[0] &&
    !preRequestErr[0] &&
    !posRequestData[0] &&
    !posRequestErr[0]
  ) {
    throw new AppError("405", "Não existe dados da solicitação informada");
  }

  return {
    loadData,
    preRequest: { data: preRequestData, error: preRequestErr },
    posRequest: { data: posRequestData, error: posRequestErr },
  };
}
