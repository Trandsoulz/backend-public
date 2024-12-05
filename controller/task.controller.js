import { Router } from "express";
import catchAsync from "../helpers/CathAsnyc.js";
import Task from "../models/task.model.js";
import createError from "http-errors";

const taskRoute = Router();

taskRoute.get(
  "/",
  catchAsync(async (req, res, next) => {
    const userId = req.id;
    let allTasks;
    let query = { _user: userId };

    // Perform this query when there is a days option
    if (req.query.days) {
      const numberOfDays = parseInt(req.query.days);

      if (numberOfDays < 1 || numberOfDays > 30)
        return next(
          createError(400, "You can only get lists within 30 days from now")
        );

      const endDate = new Date();
      const startDate = new Date(
        Date.now() - numberOfDays * 24 * 60 * 60 * 1000
      );
      // console.log(startDate, endDate);
      query.createdAt = { $lte: endDate, $gte: startDate };

      // This piece of code queries the DB to get tasks that are less than today, but greater than the 1 - 30 days ago
      allTasks = await Task.find(query).select("task createdAt _id _user");
    }

    allTasks = await Task.find(query).select("task createdAt _id _user");

    res.status(200).send({
      status: "success",
      tasksLength: allTasks.length,
      allTasks,
    });
  })
);

taskRoute.post(
  "/",
  catchAsync(async (req, res, next) => {
    const userId = req.id;

    const { task } = req.body;
    if (!task) return next(createError(400, "Add a task to the to-do nau"));

    const newTask = await Task.create({
      task,
      _user: userId,
    });

    res.status(201).send({
      status: "success",
      message: "Just added a task to the list",
      newTask,
    });
  })
);

taskRoute.patch(
  "/:taskId",
  catchAsync(async (req, res, next) => {
    const taskId = req.params.taskId;
    const userId = req.id;

    // Check if this task belongs to the user before updating
    const existingTask = await Task.findOne({ _id: taskId, _user: userId });
    if (!existingTask)
      return next(createError(401, "You are unauthorised to edit this task"));

    const { task } = req.body;
    if (!task)
      return next(
        createError(
          400,
          "You need to send an update. Or better yet, just delete the task"
        )
      );

    await Task.findByIdAndUpdate(taskId, { task });

    res.status(200).send({
      status: "successs",
      message: "Task has been updated",
    });
  })
);

taskRoute.delete(
  "/deletemany",
  catchAsync(async (req, res, next) => {
    const userId = req.id;

    await Task.deleteMany({ _user: userId });

    res.status(200).send({
      status: "success",
      message: "Tasks successfully deleted",
    });
  })
);

taskRoute.delete(
  "/:taskId",
  catchAsync(async (req, res, next) => {
    const taskId = req.params.taskId;
    const userId = req.id;

    await Task.findByIdAndDelete(taskId);

    res.status(200).send({
      status: "success",
      message: "Task successfully deleted",
    });
  })
);

export default taskRoute;

// yeseva one
