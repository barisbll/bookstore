import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const { NODE_ENV, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE } =
  process.env;
const nodeEnv = NODE_ENV || "development";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  entities: [`${nodeEnv ? "src" : "dist"}/db/entity/**/*`],
  migrations: [`${nodeEnv ? "src" : "dist"}/db/migration/**/*`],
  logging: false,
  migrationsRun: true,
  synchronize: true,
  subscribers: [],
});
