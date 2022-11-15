import express from "express";
import { appLogger, errorLogger } from "./logger";
import router from "./router";
import cors from "cors";

const app = express();

const allowedOrigins = ["http://localhost:3333"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));

app.disable("etag");
app.use(express.json());
app.use(appLogger);
app.use(router);
app.use(errorLogger);

export default app;
