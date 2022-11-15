import { Request, Response, Router } from "express";
import * as users from "./controllers/users.controller";
import * as meals from "./controllers/meals.controller";

const router = Router();

router
  .get("/", (req: Request, res: Response) => res.send("Server is running"))
  .post("/users/authenticate", users.authenticate)
  .post("/users/list", users.list)
  .post("/users/stats", users.getUserStatitics)
  //
  .get("/meals/:id", meals.get)
  .post("/meals/limits", meals.checkLimits)
  .post("/meals", meals.list)
  .post("/meals/stats", meals.getMealStatitics)
  .post("/meals/user-stats", meals.getMealCountStats)
  .put("/meals", meals.create)
  .patch("/meals/:id", meals.update)
  .delete("/meals/:id", meals.deleteMeal);

export default router;
