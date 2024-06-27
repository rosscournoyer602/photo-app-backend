require("dotenv").config();
import express from "express";
import bodyParser from "body-parser";
import { AppRouter } from "./AppRouter";
import morgan from "morgan";
import cors from "cors";
import { DataSource } from "typeorm";

import "./controllers/rootController";
import "./controllers/authController";
import "./controllers/profileController";
import "./controllers/photoController";
import "./controllers/likesController";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRESDB_HOST || "localhost",
  port: 5432,
  username: process.env.POSTGRESDB_USER || "photoapp",
  password: process.env.POSTGRESDB_ROOT_PASSWORD || "photoapp",
  database: process.env.POSTGRESDB_DATABASE || "photoapp",
  entities: ["build/entity/*.js"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  synchronize: true,
});

AppDataSource.initialize()
  .then(() => {
    const app = express();
    app.use(cors());
    app.use(morgan(":method :url :status :response-time ms"));
    app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
    app.use(bodyParser.json({ type: "*/*", limit: "50mb" }));
    app.use(AppRouter.getInstance());
    app.listen(process.env.PORT || "8080");
    console.log(`App listening on port ${process.env.PORT || "8080"}`);
  })
  .catch((error) => console.log(error));
