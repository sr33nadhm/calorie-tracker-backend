import { User, Meal } from "../../src/models";
import { Knex } from "knex";

export const up = (knex: Knex): Promise<void> =>
  knex.schema.createTable(Meal.tableName, (table: Knex.TableBuilder) => {
    table.increments();
    table.timestamps(true, true);
    table.string("name");
    table.string("date");
    table.integer("calorie");
    table.integer("price");
    table.integer("userId");
    table.foreign("userId").references("id").inTable(User.tableName);
  });

export const down = (knex: Knex): Promise<void> =>
  knex.schema.dropTable(Meal.tableName);
