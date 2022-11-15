import { Request, Response } from "express";
import * as HttpStatus from "http-status-codes";
import { Id } from "objection";
import { MealService, UserService } from "../services";

export const checkLimits = async (
  req: Request,
  res: Response
): Promise<Response> => {
  //
  const userInfo = req.body;
  const user = await UserService.getUser(userInfo.email);
  if (!user) {
    return res.status(HttpStatus.NOT_FOUND).json({
      message: "User not found",
      calorieLimit: 0,
      spendLimit: 0,
      calories: 0,
      cost: 0,
    });
  }
  //
  const meals = await MealService.getMealLimits(userInfo, Number(user.id));
  if (!meals) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Limits not found",
      calorieLimit: 0,
      spendLimit: 0,
      calories: 0,
      cost: 0,
    });
  }
  //
  return res.status(HttpStatus.OK).json({
    message: "Limits found",
    calories: meals.calorie,
    cost: meals.price,
    calorieLimit: user.calorieLimit,
    spendLimit: user.spendLimit,
  });
};

export const getMealStatitics = async (
  req: Request,
  res: Response
): Promise<Response> => {
  //
  const userInfo = req.body;
  const user = await UserService.getUser(userInfo.email);
  if (!user) {
    return res.status(HttpStatus.NOT_FOUND).json({
      message: "User not found",
      stats: [],
    });
  }
  //
  const stats = await MealService.getMealStatitics(userInfo, Number(user.id));
  if (!stats) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Error loading statistics",
      stats: [],
    });
  }
  //
  return res.status(HttpStatus.OK).json({
    message: "Statistics found",
    stats: stats,
  });
};

export const get = async (req: Request, res: Response): Promise<Response> => {
  const id: Id = req.params.id;
  const meal = await MealService.getMeal(id);
  if (meal) {
    return res.status(HttpStatus.OK).json(meal);
  } else {
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }
};

export const list = async (req: Request, res: Response): Promise<Response> => {
  const userInfo = req.body;
  const user = await UserService.getUser(userInfo.email);
  if (!user) {
    return res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });
  }
  const meals = await MealService.getAllMeals(user, userInfo);
  return res
    .status(HttpStatus.OK)
    .json({ data: meals, message: "Found meals" });
};

export const create = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, date, calorie, price, email } = req.body;
  const user = await UserService.getUser(email);
  if (!user) {
    return res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });
  }
  const meal = await MealService.insertMeal({
    name,
    date,
    calorie,
    price,
    userId: user.id,
  });

  return res.status(HttpStatus.CREATED).json(meal);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, date, calorie, price, email } = req.body;
  const id: Id = req.params.id;

  const user = await UserService.getUser(email);
  if (!user) {
    return res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });
  }

  var meal = await MealService.getMeal(id);

  if (!meal) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Food item not found" });
  }

  meal = await MealService.updateMeal(id, {
    name,
    date,
    calorie,
    price,
  });
  return res.status(HttpStatus.OK).json(meal);
};

export const deleteMeal = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: Id = req.params.id;

  const meal = await MealService.getMeal(id);

  if (!meal) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Food item not found" });
  }

  const result = await MealService.deleteMeal(id);
  return res.status(HttpStatus.OK).json(result);
};

export const getMealCountStats = async (
  req: Request,
  res: Response
): Promise<Response> => {
  //
  const userInfo = req.body;
  const user = await UserService.getUser(userInfo.email);
  if (!user) {
    return res.status(HttpStatus.NOT_FOUND).json({
      message: "User not found",
      stats: [],
    });
  }
  if (user.role !== "admin") {
    return res.status(HttpStatus.FORBIDDEN).json({
      message: "This is a restricted service",
      stats: [],
    });
  }
  //
  const stats = await MealService.getMealCountStats(userInfo);
  if (!stats) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Error loading statistics",
      stats: [],
    });
  }
  //
  return res.status(HttpStatus.OK).json({
    message: "Statistics found",
    stats: stats,
  });
};
