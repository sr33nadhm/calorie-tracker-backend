import { config } from "./src/config";
import * as path from "path";
import objection from "objection";

const defaultKnexConfig = {
  client: "pg",
  connection: {
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPass,
    database: config.dbName,
    charset: "utf8",
  },
  migrations: {
    tableName: "knex_migrations",
    directory: path.resolve("knex/migrations"),
  },
  seeds: {
    directory: path.resolve("knex/seeds"),
  },
  ...objection.knexSnakeCaseMappers(),
  useNullAsDefault: true,
};

export default {
  development: {
    ...defaultKnexConfig,
  },
  test: {
    ...defaultKnexConfig,
  },
  production: {
    ...defaultKnexConfig,
  },
};
