import { NextFunction, Request, Response } from "express";
import { Service } from "typedi";
import { ZodError } from "zod";
import HttpStatus from "http-status-codes";

export class CustomError {
  message: string;

  status: number;

  additionalInfo: Record<string, any>;

  constructor(message: string, status: number = 500, additionalInfo = {}) {
    this.message = message;
    this.status = status;
    this.additionalInfo = additionalInfo;
  }
}

export const errorHandler = (
  err: TypeError | CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line
  next: NextFunction
) => {
  let customError = err;

  if (!(err instanceof CustomError)) {
    customError = new CustomError(err.message);
  }

  if (err instanceof ZodError) {
    customError = new CustomError(
      "Validation error",
      HttpStatus.BAD_REQUEST,
      err.issues
    );
  }

  res.status((customError as CustomError).status).json(customError);
};
