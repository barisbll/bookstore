import { Service } from "typedi";
import HttpStatus from "http-status-codes";
import { In } from "typeorm";

import {
  type CategoryCreationSchemaType,
  type CategoryUpdateSchemaType,
  type IdSchemaType,
} from "../../controller/Admin/admin.schema";
import { Category } from "../../db/entity/Category";
import { AppDataSource } from "../../db/dataSource";
import { CustomError } from "../../util/errorHandler";
import { Book } from "../../db/entity/Book";

@Service()
export class CategoryService {
  getCategory = async ({ id }: IdSchemaType) => {
    try {
      const category = await AppDataSource.manager.findOne(Category, {
        where: { id },
      });

      if (!category) {
        throw new CustomError("Category not found", HttpStatus.NOT_FOUND, {
          id,
        });
      }

      return category;
    } catch (err) {
      throw new CustomError(
        "Error getting category",
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          err,
        }
      );
    }
  };

  getCategories = async () => {
    try {
      const categories = await AppDataSource.manager.find(Category);

      return categories;
    } catch (err) {
      throw new CustomError(
        "Error getting categories",
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          err,
        }
      );
    }
  };

  createCategory = async (body: CategoryCreationSchemaType) => {
    const foundCategory = await AppDataSource.manager.findOne(Category, {
      where: { name: body.name },
    });

    if (foundCategory) {
      throw new CustomError("Category already exists", HttpStatus.CONFLICT, {
        name: body.name,
      });
    }

    try {
      const category = new Category();
      category.name = body.name;

      await AppDataSource.manager.save(category);
    } catch (err) {
      throw new CustomError(
        "Error creating category",
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          err,
        }
      );
    }
  };

  updateCategory = async ({ id, name }: CategoryUpdateSchemaType) => {
    try {
      const category = await AppDataSource.manager.findOne(Category, {
        where: { id },
      });

      if (!category) {
        throw new CustomError("Category not found", HttpStatus.NOT_FOUND, {
          id,
        });
      }

      category.name = name;

      await AppDataSource.manager.save(category);
    } catch (err) {
      throw new CustomError(
        "Error updating category",
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          err,
        }
      );
    }
  };

  deleteCategory = async ({ id }: IdSchemaType) => {
    try {
      const category = await AppDataSource.manager.findOne(Category, {
        where: { id },
      });

      if (!category) {
        throw new CustomError("Category not found", HttpStatus.NOT_FOUND, {
          id,
        });
      }

      await AppDataSource.manager.remove(category);
    } catch (err) {
      throw new CustomError(
        "Error deleting category",
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          err,
        }
      );
    }
  };

  getBooksByCategory = async (categoryName: string) => {
    try {
      const category = await AppDataSource.manager.findOne(Category, {
        where: { name: categoryName },
        relations: ["books"],
      });

      if (!category) {
        throw new CustomError("Category not found", HttpStatus.NOT_FOUND, {
          categoryName,
        });
      }

      return category.books.filter((book) => book.numberOfCopies > 0);
    } catch (err) {
      throw new CustomError(
        "Error getting books by category",
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          err,
        }
      );
    }
  };

  getBooksByCategories = async (categoryNames: string[]) => {
    try {
      const categories = await AppDataSource.manager.find(Category, {
        where: { name: In(categoryNames) },
        relations: ["books"],
      });

      if (!categories) {
        throw new CustomError("Categories not found", HttpStatus.NOT_FOUND, {
          categoryNames,
        });
      }

      const books = categories.map((category) => category.books).flat();
      const booksWithStock = books.filter((book) => book.numberOfCopies > 0);

      return booksWithStock;
    } catch (err) {
      throw new CustomError(
        "Error getting books by categories",
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          err,
        }
      );
    }
  };
}
