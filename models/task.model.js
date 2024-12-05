import { Schema, model } from "mongoose";

const TaskSchema = new Schema(
  {
    task: {
      type: String,
      trim: true,
      unique: true,
    },
    _user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Task = model("Task", TaskSchema);

export default Task;
