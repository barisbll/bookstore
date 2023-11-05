import { Service } from "typedi";
import { type NextFunction, type Request, type Response } from "express";

import { BookService } from "../../service/Book/book.service";
import { CategoryService } from "../../service/Category/category.service";
import {
  CategoryCreationSchema,
  type CategoryCreationSchemaType,
  CategoryUpdateSchema,
  type CategoryUpdateSchemaType,
  IdSchema,
  type IdSchemaType,
  BookCreationSchema,
  type BookCreationSchemaType,
  BookUpdateSchema,
  type BookUpdateSchemaType,
} from "./admin.schema";

@Service()
export class AdminController {
  constructor(
    private readonly bookService: BookService,
    private readonly categoryService: CategoryService
  ) {}

  getCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const body: IdSchemaType = IdSchema.parse({ id });

      const category = await this.categoryService.getCategory(body);

      res.status(200).json(category);
    } catch (err) {
      next(err);
    }
  };

  getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.categoryService.getCategories();

      res.status(200).json(categories);
    } catch (err) {
      next(err);
    }
  };

  postCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: CategoryCreationSchemaType = CategoryCreationSchema.parse(
        req.body
      );

      await this.categoryService.createCategory(body);

      res.sendStatus(201);
    } catch (err) {
      next(err);
    }
  };

  putCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const body: CategoryUpdateSchemaType = CategoryUpdateSchema.parse({
        id,
        name,
      });

      await this.categoryService.updateCategory({ id, name });

      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  };

  deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const body: IdSchemaType = IdSchema.parse({ id });

      await this.categoryService.deleteCategory(body);

      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  };

  getBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const body: IdSchemaType = IdSchema.parse({ id });

      const book = await this.bookService.getBook(body);

      res.status(200).json(book);
    } catch (err) {
      next(err);
    }
  };

  getBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const books = await this.bookService.getBooks();

      res.status(200).json(books);
    } catch (err) {
      next(err);
    }
  };

  postBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: BookCreationSchemaType = BookCreationSchema.parse(req.body);

      await this.bookService.createBook(body);

      res.sendStatus(201);
    } catch (err) {
      next(err);
    }
  };

  putBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const body: BookUpdateSchemaType = BookUpdateSchema.parse({
        id,
        ...req.body,
      });

      await this.bookService.updateBook(body);

      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  };

  deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const body: IdSchemaType = IdSchema.parse({ id });

      await this.bookService.deleteBook(body);

      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  };
}
