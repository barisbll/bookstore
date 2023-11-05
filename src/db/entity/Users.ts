import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Book } from "./Book";

export enum UserRole {
  NORMAL = "normal",
  ADMIN = "admin",
}

@Entity()
export class Users {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.NORMAL,
  })
  role: UserRole;

  @ManyToMany(() => Book)
  @JoinTable()
  books: Book[];
}
