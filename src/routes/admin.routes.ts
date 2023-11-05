import { type Application } from "express";
import Container from "typedi";

import { AdminController } from "../controller/Admin/admin.controller";
import { isAdmin } from "../middleware/is-auth";

export const adminRoutes = (app: Application) => {
  const adminController = Container.get(AdminController);

  app.get("/category/:id", isAdmin, adminController.getCategory);

  app.get("/categories", isAdmin, adminController.getCategories);

  app.post("/category", isAdmin, adminController.postCategory);

  app.put("/category/:id", isAdmin, adminController.putCategory);

  app.delete("/category/:id", isAdmin, adminController.deleteCategory);

  app.get("/book/:id", isAdmin, adminController.getBook);

  app.get("/books", isAdmin, adminController.getBooks);

  app.post("/book", isAdmin, adminController.postBook);

  app.put("/book/:id", isAdmin, adminController.putBook);

  app.delete("/book/:id", isAdmin, adminController.deleteBook);
};
