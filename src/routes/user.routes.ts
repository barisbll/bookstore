import { type Application } from "express";
import Container from "typedi";

import { UserController } from "../controller/User/user.controller";
import { isNormalUser } from "../middleware/is-auth";

export const userRoutes = (app: Application) => {
  const userController = Container.get(UserController);

  app.get("/search", userController.getSearch);

  app.post("/cart", isNormalUser, userController.postCart);

  app.post("/checkout", isNormalUser, userController.postCheckout);
};
