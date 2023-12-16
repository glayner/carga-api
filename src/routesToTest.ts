import {Router} from 'express'
import RespositoryJson from './common/database/repository.js'

const routesToTest = Router()


routesToTest.get('/parametro1', (request, response)=>{
  const value = Date.now()
  console.log('\nparametro1', new Date().toLocaleString(), value, '\n')
  return response.cookie('parametro1Test', value).send({numero1: 50})
})

routesToTest.get('/parametro2', (request, response)=>{
  console.log('\nparametro2', new Date().toLocaleString(), '\n')
  return response.send({numero2: 30})
})

routesToTest.post('/soma', (request, response)=>{
  console.log(request.body,'soma' , new Date().toLocaleString())
  const {numero1, numero2} = request.body
  return response.send({resposta: Number(numero1) + Number(numero2)})
})

export {routesToTest}