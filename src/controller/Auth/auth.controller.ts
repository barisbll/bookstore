import { Service } from "typedi";
import HttpStatus from "http-status-codes";
import { type NextFunction, type Request, type Response } from "express";
import {
  LoginSchema,
  type LoginSchemaType,
  RegisterSchema,
  type RegisterSchemaType,
} from "./auth.schema";
import { UserService } from "../../service/User/user.service";

@Service()
export class AuthController {
  constructor(private readonly userService: UserService) {}

  postRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: RegisterSchemaType = RegisterSchema.parse(req.body);

      await this.userService.registerNewUser(body);

      res.sendStatus(HttpStatus.CREATED);
    } catch (err) {
      next(err);
    }
  };

  postLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: LoginSchemaType = LoginSchema.parse(req.body);

      const token = await this.userService.login(body);

      res.status(HttpStatus.OK).send({ token });
    } catch (err) {
      next(err);
    }
  };
}
