import { fn, raw, ref } from "objection";
import { Meal, User } from "../models";
//
export const getMeal = async (id: string) => {
  const result = await Meal.query().findById(id);
  return result;
};

export const getAllMeals = async (user: User, filter: any) => {
  var result;
  var query = Meal.query().select();
  if (filter.after) {
    query = query.where("date", ">=", filter.after);
  }
  if (filter.before) {
    query = query.where("date", "<", filter.before);
  }
  if (user.role === "admin") {
    result = await query
      .withGraphFetched("user")
      .orderBy("date", "desc")
      .page(filter.page, filter.limit);
  } else {
    result = await query
      .where("userId", user.id.toString())
      .orderBy("date", "desc")
      .page(filter.page, filter.limit);
  }
  return result;
};

export const insertMeal = async (meal: Object) => {
  const result = await Meal.query().insert(meal);
  return result;
};

export const updateMeal = async (id: string, meal: Object) => {
  await Meal.query().where("id", id).update(meal);
  return await Meal.query().findById(id);
};

export const deleteMeal = async (id: string) => {
  const result = await Meal.query().del().where("id", id);
  return result;
};
//

export const getMealLimits = async (
  userInfo: { before: string; after: string },
  userId: number
) => {
  const meals = await Meal.query()
    .where("userId", userId)
    .where("createdAt", ">=", userInfo.after)
    .where("createdAt", "<", userInfo.before)
    .sum("calorie as calorie")
    .sum("price as price");
  return meals[0];
};

export const getMealCountStats = async (userInfo: any) => {
  var query = Meal.query().alias("p");
  if (userInfo.after) {
    query = query.where("p.date", ">=", userInfo.after);
  }
  if (userInfo.before) {
    query = query.where("p.date", "<", userInfo.before);
  }
  const stats = await query
    .select(fn.coalesce(fn.sum(ref("p.calorie")), 0).as("totalCal"))
    .count("p.id as totalEntries")
    .countDistinct("p.userId as totalUsers");
  return stats[0];
};

export const getMealStatitics = async (userInfo: any, userId: number) => {
  var query = Meal.query()
    .alias("p")
    .select([raw("strftime('%d-%m-%Y', p.date) as date")])
    .where("p.userId", userId);
  if (userInfo.after) {
    query = query.where("p.date", ">=", userInfo.after);
  }
  if (userInfo.before) {
    query = query.where("p.date", "<", userInfo.before);
  }
  const stats = await query
    .sum("calorie as calorie")
    .sum("price as price")
    .count("id as count")
    .groupByRaw("strftime('%d-%m-%Y', p.date)")
    .orderByRaw("strftime('%Y-%m-%d', p.date) desc")
    .page(userInfo.page, userInfo.limit);
  return stats;
};
