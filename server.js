import dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";
import createError from "http-errors";
import cors from "cors";
import DBCONNECT from "./db/db.js";
import globalErrorHandler from "./helpers/error.controller.js";
import { authRoute, validateUser } from "./controller/auth.controller.js";
import taskRoute from "./controller/task.controller.js";

const { PORT, NODE_ENV } = process.env;
const app = express();

DBCONNECT();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

if (NODE_ENV === "dev") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("common"));
}

app.get("/", (_, res, next) => {
  res.status(200).send({
    status: "success",
    message: "To-do list server is functional",
  });
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/task", validateUser, taskRoute);

app.all("*", (req, res, next) => {
  return next(
    createError(404, `Can't find "${req.originalUrl}", on the server`)
  );
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
  // console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`Server listening PORT:${PORT}`);
});
