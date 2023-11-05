import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { startRoutes } from "./routes/routes";
import { AppDataSource } from "./db/dataSource";
import { errorHandler } from "./util/errorHandler";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

startRoutes(app);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    const port = process.env.PORT || 8000;

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error while connecting to db", err);
  });

app.use(errorHandler);
