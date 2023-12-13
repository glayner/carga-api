import express from "express";
import { routesToTest } from "./routesToTest.js";
import "express-async-errors";
import cors from "cors";
import helmet from "helmet";
import route from "./routes.js";
import errorHandlerMiddleware from "./common/middleware/error-handler.middleware.js";
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(route);
app.use(errorHandlerMiddleware);
app.listen(3000, () => {
  console.log("server running in port 3000");
});
