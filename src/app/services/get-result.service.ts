import RespositoryJson from '../../common/database/repository.js'
import AppError from '../../common/errors/app-error.js'
interface GetResultServiceDTO{
  key: string
  before?: Date
  after?: Date
}

const validData = (current: Date, before?: Date, after?: Date) =>{
  let valid = true
  if(after){
    valid = after <= current
  }
  if(before && valid){
    valid = before >= current
  }
  return valid
}
export async function getResultService({key, after, before}: GetResultServiceDTO){
  const result = await RespositoryJson.readLoadTestByKey(key)
if(!result){
throw new AppError('404', 'não existe dados dessa solicitação')  
}

if(after || before){
  const loadData = result.loadData.map(l =>{
    const current = new Date(l.start)
   if(validData(current,before,after)){
     return l
   }
  }).filter(Boolean)
  const preRequestData = result.preRequest.data.map(pd =>{
    const current = new Date(pd.date)

   if(validData(current,before,after)){
     return pd
   }
  }).filter(Boolean)
  const preRequestErr = result.preRequest.error.map(pe =>{
    const current = new Date(pe.date)

   if(validData(current,before,after)){
     return pe
   }
  }).filter(Boolean)
  const posRequestData = result.posRequest.data.map(pd =>{
    const current = new Date(pd.date)

   if(validData(current,before,after)){
     return pd
   }
  }).filter(Boolean)
  const posRequestErr = result.posRequest.error.map(pe =>{
    const current = new Date(pe.date)

   if(validData(current,before,after)){
     return pe
   }
  }).filter(Boolean)

  if(!loadData[0] && !preRequestData[0] && !preRequestErr[0] && !posRequestData[0] && !posRequestErr[0]){
    throw new AppError('405', 'não existe dados na data solicitação')  
  }

  return {
    loadData,
    preRequest: { data: preRequestData, error: preRequestErr },
    posRequest: { data: posRequestData, error: posRequestErr},
  }
}
  return result
}