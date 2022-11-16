import { Knex } from "knex";
import { Meal } from "../../src/models";

const now = new Date();

const meals = [
  {
    id: 1,
    name: "Pizza",
    date: now.toISOString(),
    calorie: 500,
    price: 15,
    userId: 2,
  },
  {
    id: 2,
    name: "Pasta",
    date: now.toISOString(),
    calorie: 300,
    price: 20,
    userId: 2,
  },
  {
    id: 3,
    name: "Pudding",
    date: now.toISOString(),
    calorie: 250,
    price: 10,
    userId: 2,
  },
];

export const seed = async (knex: Knex): Promise<void> => {
  await knex(Meal.tableName).del();
  await knex(Meal.tableName).insert(meals);
};
