import RespositoryJson from '../../common/database/repository.js'
interface GetResultServiceDTO{
  key: string
}
export async function getResultService({key}: GetResultServiceDTO){
  const result = await RespositoryJson.readLoadTestByKey(key)

  return result
}