import { type Application } from "express";
import { authRoutes } from "./auth.routes";
import { adminRoutes } from "./admin.routes";
import { userRoutes } from "./user.routes";

export const startRoutes = (app: Application) => {
  app.get("/health", (req, res) => {
    res.send("healthy");
  });

  authRoutes(app);
  adminRoutes(app);
  userRoutes(app);
};
