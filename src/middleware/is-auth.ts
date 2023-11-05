import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomError } from "../util/errorHandler";
import dotenv from "dotenv";
import { UserRole } from "../db/entity/Users";

dotenv.config();

const { JWT_SECRET } = process.env;

export interface Token extends JwtPayload {
  email: string;
  role: UserRole;
  id: string;
  iat: number;
  exp: number;
}

export interface ExtendedRequest extends Request {
  decodedToken?: Token;
}

export const isNormalUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.get("Authorization");

  try {
    if (!authHeader) {
      throw new CustomError("Not authenticated", 401);
    }

    const token = authHeader.split(" ")[1];

    const decodedToken: Token = jwt.verify(
      token,
      JWT_SECRET || "secret"
    ) as Token;

    if (!decodedToken) {
      throw new CustomError("Not authenticated", 401);
    }

    if (decodedToken.role !== UserRole.NORMAL) {
      throw new CustomError("Not authorized, user role isn't normal user", 403);
    }

    (req as ExtendedRequest).decodedToken = decodedToken;

    next();
  } catch (err) {
    next(err);
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");

  try {
    if (!authHeader) {
      throw new CustomError("Not authenticated", 401);
    }

    const token = authHeader.split(" ")[1];

    const decodedToken: Token = jwt.verify(
      token,
      JWT_SECRET || "secret"
    ) as Token;

    if (!decodedToken) {
      throw new CustomError("Not authenticated", 401);
    }

    if (decodedToken.role !== UserRole.ADMIN) {
      throw new CustomError("Not authorized, user role isn't admin", 403);
    }

    (req as ExtendedRequest).decodedToken = decodedToken;

    next();
  } catch (err) {
    next(err);
  }
};
