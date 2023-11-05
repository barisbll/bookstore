import { Service } from "typedi";
import { type NextFunction, type Request, type Response } from "express";

import { BookService } from "../../service/Book/book.service";
import { CategoryService } from "../../service/Category/category.service";
import { UserService } from "../../service/User/user.service";
import { IdSchema, type IdSchemaType } from "../Admin/admin.schema";
import { ExtendedRequest } from "../../middleware/is-auth";
import { AddToCartSchema, type AddToCartSchemaType } from "./user.schema";

@Service()
export class UserController {
  constructor(
    private readonly bookService: BookService,
    private readonly categoryService: CategoryService,
    private readonly userService: UserService
  ) {}

  getSearch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category } = req.query;
      let books;

      if (!category) {
        books = await this.bookService.getBooks();
        return res.status(200).json(books);
      }

      if (Array.isArray(category)) {
        books = await this.categoryService.getBooksByCategories(
          category as string[]
        );
        return res.status(200).json(books);
      }

      books = await this.categoryService.getBooksByCategory(category as string);

      res.status(200).json(books);
    } catch (err) {
      next(err);
    }
  };

  postCart = async (
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const body: AddToCartSchemaType = AddToCartSchema.parse({
        userId: req.decodedToken?.id as string,
        bookId: req.body.bookId,
      });

      await this.userService.addToCart(body);

      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  };

  postCheckout = async (
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const body: IdSchemaType = IdSchema.parse({
        id: req.decodedToken?.id as string,
      });

      await this.userService.checkout(body);

      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  };
}
