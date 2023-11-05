import { Service } from "typedi";
import HttpStatus from "http-status-codes";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import {
  type RegisterSchemaType,
  type LoginSchemaType,
} from "../../controller/Auth/auth.schema";
import { AppDataSource } from "../../db/dataSource";
import { Users, UserRole } from "../../db/entity/Users";
import { Book } from "../../db/entity/Book";
import { CustomError } from "../../util/errorHandler";
import { type AddToCartSchemaType } from "../../controller/User/user.schema";
import { IdSchemaType } from "../../controller/Admin/admin.schema";

dotenv.config();
const { JWT_SECRET } = process.env;

const THIRTY_MINUTES = 1_000 * 60 * 30;

@Service()
export class UserService {
  registerNewUser = async (body: RegisterSchemaType): Promise<void> => {
    const foundUser = await AppDataSource.manager.findOne(Users, {
      where: { email: body.email },
    });

    if (foundUser) {
      throw new CustomError("User already exists", HttpStatus.CONFLICT, {
        email: body.email,
      });
    }

    try {
      const user = new Users();
      user.password = await hash(body.password, 12);
      user.email = body.email;
      user.role = UserRole.NORMAL;

      await AppDataSource.manager.save(user);
    } catch (err) {
      throw new CustomError(
        "Error creating user",
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          err,
        }
      );
    }
  };

  createToken = (id: string, email: string, role: UserRole): string => {
    const token = jwt.sign({ id, email, role }, JWT_SECRET as string, {
      expiresIn: "72h",
    });

    return token;
  };

  login = async (body: LoginSchemaType): Promise<string> => {
    const user = await AppDataSource.manager.findOne(Users, {
      where: { email: body.email },
    });

    if (!user) {
      throw new CustomError(
        "A user with that email does not exist",
        HttpStatus.UNAUTHORIZED,
        {
          email: body.email,
        }
      );
    }
    const isPasswordValid = await compare(body.password, user.password);

    if (!isPasswordValid) {
      throw new CustomError(
        "Invalid email or password",
        HttpStatus.UNAUTHORIZED
      );
    }

    return this.createToken(user.id, user.email, user.role);
  };

  addToCart = async (body: AddToCartSchemaType): Promise<void> => {
    const foundUser = await AppDataSource.manager.findOne(Users, {
      where: { id: body.userId },
      relations: {
        books: true,
      },
    });

    if (!foundUser) {
      throw new CustomError("User not found", HttpStatus.NOT_FOUND, {
        id: body.userId,
      });
    }

    const foundBook = await AppDataSource.manager.findOne(Book, {
      where: { id: body.bookId },
    });

    if (!foundBook) {
      throw new CustomError("Book not found", HttpStatus.NOT_FOUND, {
        id: body.bookId,
      });
    }

    if (foundBook.numberOfCopies <= 0) {
      throw new CustomError(
        "Book is out of stock",
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          id: body.bookId,
        }
      );
    }

    const foundUserBook = foundUser.books.find(
      (book) => book.id === body.bookId
    );

    if (foundUserBook) {
      throw new CustomError("Book already in cart", HttpStatus.CONFLICT, {
        id: body.bookId,
      });
    }

    try {
      foundUser.books.push(foundBook);
      await AppDataSource.manager.save(foundUser);

      // Remove book from cart after 30 minutes
      setTimeout(async () => {
        const foundUser = await AppDataSource.manager.findOne(Users, {
          where: { id: body.userId },
          relations: {
            books: true,
          },
        });

        if (!foundUser) {
          return;
        }

        const foundUserBook = foundUser.books.find(
          (book) => book.id === body.bookId
        );

        if (!foundUserBook) {
          return;
        }

        foundUser.books = foundUser.books.filter(
          (book) => book.id !== foundUserBook.id
        );

        await AppDataSource.manager.save(foundUser);
      }, THIRTY_MINUTES);
    } catch (err) {
      throw new CustomError(
        "Error adding book to cart",
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          err,
        }
      );
    }
  };

  checkout = async (body: IdSchemaType): Promise<void> => {
    try {
      const foundUser = await AppDataSource.manager.findOne(Users, {
        where: { id: body.id },
        relations: {
          books: true,
        },
      });

      if (!foundUser) {
        throw new CustomError("User not found", HttpStatus.NOT_FOUND, {
          id: body.id,
        });
      }

      if (foundUser.books.length <= 0) {
        throw new CustomError(
          "Cart is empty",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      await AppDataSource.manager.transaction(
        async (transactionalEntityManager) => {
          foundUser.books.forEach(async (book) => {
            if (book.numberOfCopies <= 0) {
              throw new CustomError(
                "Book is out of stock",
                HttpStatus.INTERNAL_SERVER_ERROR,
                {
                  id: book.id,
                }
              );
            }

            book.numberOfCopies -= 1;
            await transactionalEntityManager.save(book);
          });
          foundUser.books = [];
          await transactionalEntityManager.save(foundUser);
        }
      );
    } catch (err) {
      throw new CustomError(
        "Error checking out",
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          err,
        }
      );
    }
  };
}
