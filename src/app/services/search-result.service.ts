import RespositoryJson, { Carga } from "../../common/database/repository.js";
import AppError from "../../common/errors/app-error.js";
interface SearchResultServiceDTO {
  namespace?: string;
  version?: string;
  scenario?: string;
  before?: Date;
  after?: Date;
}

const validDate = (current: Date, before?: Date, after?: Date) => {
  let valid = true;
  if (after) {
    valid = after <= current;
  }
  if (before && valid) {
    valid = before >= current;
  }
  return valid;
};

export async function searchResultService({
  namespace,
  version,
  scenario,
  after,
  before,
}: SearchResultServiceDTO) {
  const data = await RespositoryJson.listLoadTestResult();

  let loadDataSearched = (data.map(register =>{
    let valid = true
    if(namespace){
      valid = register.key.includes(namespace)
    }
    if(version){
      valid = register.key.includes(version)
    }
    if(scenario){
      valid = register.key.includes(scenario)
    }

    if(valid){
      return register
    }
  }).filter(Boolean))

  if (!loadDataSearched || !loadDataSearched[0]) {
    throw new AppError("404", "não existe dados dessa solicitação");
  }

  if (after || before) {
    loadDataSearched =  loadDataSearched.map((result )=>{
      if(!result){
        return
      }      
    const loadData = result.loadData
      .map((l) => {
        const current = new Date(l.start);
        if (validDate(current, before, after)) {
          return l;
        }
      })
      .filter(Boolean);
    const preRequestData = result.preRequest.data
      .map((pd) => {
        const current = new Date(pd.date);

        if (validDate(current, before, after)) {
          return pd;
        }
      })
      .filter(Boolean);
    const preRequestErr = result.preRequest.error
      .map((pe) => {
        const current = new Date(pe.date);

        if (validDate(current, before, after)) {
          return pe;
        }
      })
      .filter(Boolean);
    const posRequestData = result.posRequest.data
      .map((pd) => {
        const current = new Date(pd.date);

        if (validDate(current, before, after)) {
          return pd;
        }
      })
      .filter(Boolean);
    const posRequestErr = result.posRequest.error
      .map((pe) => {
        const current = new Date(pe.date);

        if (validDate(current, before, after)) {
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
      return
    }

    return {
      key: result.key,
      loadData,
      preRequest: { data: preRequestData, error: preRequestErr },
      posRequest: { data: posRequestData, error: posRequestErr },
    };
  }).filter(Boolean)
  }
  return loadDataSearched;
}
