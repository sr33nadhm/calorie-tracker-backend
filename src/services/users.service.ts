import { fn, raw, ref } from "objection";
import { User } from "../models";
//
export const getUser = async (email: string) => {
  const user = await User.query().select().where("email", email);
  return user[0];
};

export const insertUser = async (userInfo: User) => {
  var newUser = await User.query().insertAndFetch(userInfo);
  return newUser;
};

export const listUsers = async () => {
  const users = await User.query()
    .select(["name", "email"])
    .where("role", "user");
  return users;
};

export const getUserStatitics = async (userInfo: any, userId: number) => {
  var query = User.query()
    .alias("p")
    .join("meals", "p.id", "=", "meals.userId")
    .select(["p.email", "p.name"]);
  if (userInfo.after) {
    query = query.where("meals.date", ">=", userInfo.after);
  }
  if (userInfo.before) {
    query = query.where("meals.date", "<", userInfo.before);
  }
  const stats = await query
    .select(fn.coalesce(fn.sum(ref("meals.calorie")), 0).as("totalCal"))
    .select(fn.coalesce(fn.count(ref("meals.id")), 0).as("totalItems"))
    .groupBy(["p.email", "p.name"])
    .page(userInfo.page, userInfo.limit);
  return stats;
};
