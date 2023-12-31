import cors from "cors";
import "dotenv/config";
import express from "express";
import "express-async-errors";
import helmet from "helmet";
import errorHandlerMiddleware from "./common/middleware/error-handler.middleware.js";
import route from "./routes.js";
import { deleteDatabaseRegisterEveryWeek } from "./app/services/cron-task.service.js";
const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);

deleteDatabaseRegisterEveryWeek();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(route);
app.use(errorHandlerMiddleware);
app.listen(3000, () => {
  console.info("server running in port 3000");
});
