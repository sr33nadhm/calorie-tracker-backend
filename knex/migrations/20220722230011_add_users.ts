import { Knex } from "knex";
import { User } from "../../src/models";

export const up = (knex: Knex): Promise<void> =>
  knex.schema.createTable(User.tableName, (table: Knex.TableBuilder) => {
    table.increments();
    table.timestamps(true, true);
    table.string("name").notNullable();
    table.string("email").unique().notNullable();
    table.enu("role", ["admin", "user"]).defaultTo("user").notNullable();
    table.integer("calorieLimit").defaultTo(2100).notNullable();
    table.integer("spendLimit").defaultTo(1000).notNullable();
  });

export const down = (knex: Knex): Promise<void> =>
  knex.schema.dropTable(User.tableName);
