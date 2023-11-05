import { type Application } from "express";
import { AuthController } from "../controller/Auth/auth.controller";
import Container from "typedi";

export const authRoutes = (app: Application) => {
  const authController = Container.get(AuthController);

  app.post("/register", authController.postRegister);

  app.post("/login", authController.postLogin);
};
