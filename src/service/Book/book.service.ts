import { Service } from "typedi";
import HttpStatus from "http-status-codes";

import {
  type IdSchemaType,
  type BookCreationSchemaType,
  type BookUpdateSchemaType,
} from "../../controller/Admin/admin.schema";
import { Book } from "../../db/entity/Book";
import { Category } from "../../db/entity/Category";
import { AppDataSource } from "../../db/dataSource";
import { CustomError } from "../../util/errorHandler";
import { MoreThan } from "typeorm";

@Service()
export class BookService {
  getBook = async ({ id }: IdSchemaType) => {
    try {
      const book = await AppDataSource.manager.findOne(Book, {
        where: { id },
        relations: {
          category: true,
        },
      });

      if (!book) {
        throw new CustomError("Book not found", HttpStatus.NOT_FOUND, {
          id,
        });
      }

      return book;
    } catch (err) {
      throw new CustomError(
        "Error getting book",
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          err,
        }
      );
    }
  };

  getBooks = async () => {
    try {
      const books = await AppDataSource.manager.find(Book, {
        relations: {
          category: true,
        },
        where: {
          numberOfCopies: MoreThan(0),
        },
        select: {
          category: {
            name: true,
          },
        },
      });

      return books;
    } catch (err) {
      throw new CustomError(
        "Error getting books",
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          err,
        }
      );
    }
  };

  createBook = async (body: BookCreationSchemaType) => {
    const foundBook = await AppDataSource.manager.findOne(Book, {
      where: { title: body.title },
    });

    if (foundBook) {
      throw new CustomError("Book already exists", HttpStatus.CONFLICT, {
        title: body.title,
      });
    }

    const foundCategory = await AppDataSource.manager.findOne(Category, {
      where: { id: body.category },
    });

    if (!foundCategory) {
      throw new CustomError("Category not found", HttpStatus.NOT_FOUND, {
        category: body.category,
      });
    }

    const book = new Book();

    book.title = body.title;
    book.yearPublished = body.date;
    book.category = foundCategory;
    book.authorName = body.authorName;
    book.price = body.price;
    book.numberOfCopies = body.numberOfCopies;

    try {
      await AppDataSource.manager.save(book);
    } catch (err) {
      throw new CustomError(
        "Error creating book",
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          err,
        }
      );
    }
  };

  updateBook = async (body: BookUpdateSchemaType) => {
    const foundBook = await AppDataSource.manager.findOne(Book, {
      where: { id: body.id },
      relations: {
        category: true,
      },
    });

    if (!foundBook) {
      throw new CustomError("Book not found", HttpStatus.NOT_FOUND, {
        id: body.id,
      });
    }

    if (body.category && body.category !== foundBook.category.id) {
      const foundCategory = await AppDataSource.manager.findOne(Category, {
        where: { id: body.category },
      });

      if (!foundCategory) {
        throw new CustomError("Category not found", HttpStatus.NOT_FOUND, {
          category: body.category,
        });
      }

      foundBook.category = foundCategory;
    }

    try {
      foundBook.title = body.title || foundBook.title;
      foundBook.yearPublished = body.date || foundBook.yearPublished;
      foundBook.authorName = body.authorName || foundBook.authorName;
      foundBook.price = body.price || foundBook.price;

      await AppDataSource.manager.save(foundBook);
    } catch (err) {
      throw new CustomError(
        "Error updating book",
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          err,
        }
      );
    }
  };

  deleteBook = async ({ id }: IdSchemaType) => {
    try {
      const book = await AppDataSource.manager.findOne(Book, {
        where: { id },
      });

      if (!book) {
        throw new CustomError("Book not found", HttpStatus.NOT_FOUND, {
          id,
        });
      }

      await AppDataSource.manager.remove(book);
    } catch (err) {
      throw new CustomError(
        "Error deleting book",
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          err,
        }
      );
    }
  };
}
