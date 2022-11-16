import { Knex } from "knex";
import { User } from "../../src/models";

const users = [
  {
    id: 1,
    name: "Sreenadh M",
    email: "sreenadhm01@gmail.com",
    role: "admin",
  },
  {
    id: 2,
    name: "Sreenath M",
    email: "sreenathpurushothaman@gmail.com",
    role: "user",
  },
];

export const seed = async (knex: Knex): Promise<void> => {
  await knex(User.tableName).del();
  await knex(User.tableName).insert(users);
};
