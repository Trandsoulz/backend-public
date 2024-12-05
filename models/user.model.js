import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "A user must have a mail"],
      unique: true,
      validate: [validator.isEmail, "It's not a valid email"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minlength: [8, "Passwords should not be less than 8 characters"],
    },
    hashedPassword: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  this.hashedPassword = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePasswords = function (loginPassword, hashedPassword) {
  return bcrypt.compare(loginPassword, hashedPassword);
};

const User = model("User", UserSchema);

export default User;
