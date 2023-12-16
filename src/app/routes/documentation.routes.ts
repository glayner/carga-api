import {Router} from 'express'
import swaggerUi from 'swagger-ui-express'
import DocumentationConfig from '../documentation/index.js'

const documentationRoutes = Router()

documentationRoutes.use('/', swaggerUi.serve, swaggerUi.setup(DocumentationConfig))

export default documentationRoutes