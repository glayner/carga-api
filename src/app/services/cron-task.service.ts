import cron, {} from 'node-cron'
import RespositoryJson from "../../common/database/repository.js";

export const deleteDatabaseRegisterEveryWeek = ()=>{
  // * todo (*/5 * * * * executa a cada 5 minutos)
  // , varios prefixados (10,20,30 * * * * executa em todos minutos 10 20 e 30)
  // - range de valor (5-10 * * * * executa todos os minutos entre o minuto 5 e 10)
  // 0-59   0-23  1-31  1-12 0-7
  // minuto hora diaMes mes  diaSemana comando

  cron.schedule("39 16 * * 4", () => {
    console.log('entrou no cronjob')
    const oneWeekAgo = new Date(new Date().getDate() - 7)
    RespositoryJson.deleteBeforeOf(new Date('2023-12-14T19:36:59.352Z'))
  });
}