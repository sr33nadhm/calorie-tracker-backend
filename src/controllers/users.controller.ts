import { Request, Response } from "express";
import * as HttpStatus from "http-status-codes";
import { UserService } from "../services";

export const authenticate = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userInfo = req.body;
  const user = await UserService.getUser(userInfo.email);
  if (!user) {
    if (userInfo.checkOnly && userInfo.checkOnly === true) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Unable to authenticate user" });
    }
    try {
      delete userInfo.checkOnly;
      var newUser = await UserService.insertUser(userInfo);
      return res.status(HttpStatus.CREATED).json(newUser);
    } catch (e) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Unable to authenticate user", err: String(e) });
    }
  }
  return res.status(HttpStatus.OK).json(user);
};

export const list = async (req: Request, res: Response): Promise<Response> => {
  const userInfo = req.body;
  const user = await UserService.getUser(userInfo.email);
  if (!user) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Unable to authenticate user" });
  }
  if (user.role === "admin") {
    var users = await UserService.listUsers();
    return res.status(HttpStatus.OK).json(users);
  }
  return res.sendStatus(HttpStatus.FORBIDDEN);
};

export const getUserStatitics = async (
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
  const stats = await UserService.getUserStatitics(userInfo, Number(user.id));
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
