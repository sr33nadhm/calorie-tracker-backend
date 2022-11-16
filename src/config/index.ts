import * as dotenv from "dotenv";

dotenv.config();

enum NodeEnv {
  TEST = "test",
  DEV = "development",
}

interface Env {
  env: NodeEnv;
  knexDebug: boolean;
  port: number;
  defaultPage: number;
  defaultPageSize: number;
  dbHost: string;
  dbUser: string;
  dbPass: string;
  dbName: string;
}

export const config: Env = {
  env: (process.env.NODE_ENV as NodeEnv) || NodeEnv.DEV,
  knexDebug: process.env.KNEX_DEBUG === "true",
  port: parseInt(process.env.PORT),
  defaultPage: 0,
  defaultPageSize: 10,
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPass: process.env.DB_PASS,
  dbName: process.env.DB_NAME,
};
