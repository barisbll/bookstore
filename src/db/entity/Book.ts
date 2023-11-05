import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Category } from "./Category";

@Entity()
export class Book {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  yearPublished: Date;

  @Column()
  authorName: string;

  @Column()
  price: number;

  @Column()
  numberOfCopies: number;

  @ManyToOne(() => Category, (category) => category.books)
  category: Category;
}
