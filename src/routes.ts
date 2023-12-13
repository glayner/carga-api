import {Router} from 'express'
import runnerRoutes from './app/routes/runner.routes.js'
import { routesToTest } from './routesToTest.js';

const route = Router()

route.use("/test", routesToTest);
route.use("/teste-carga", runnerRoutes);

export default route