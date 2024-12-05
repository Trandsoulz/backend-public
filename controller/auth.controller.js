import { Router } from "express";
import createError from "http-errors";
import catchAsync from "../helpers/CathAsnyc.js";
import User from "../models/user.model.js";
import { signToken, decodeToken } from "../helpers/token.js";

const authRoute = Router();

const validateUser = catchAsync(async (req, res, next) => {
  //   Get and check if authorisation headers exists
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(createError(401, "You are unauthorised"));

  // verify token afterwards
  const authToken = authHeader.split(" ")[1];
  if (!authToken) return next(createError(401, "Invalid token"));

  const { iat, id, exp } = await decodeToken(authToken);

  const user = await User.findById(id);
  if (!user) return next(createError(401, "User with Id does not exist"));

  req.id = id;
  next();
});

authRoute.post(
  "/signup",
  catchAsync(async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword)
      return next(createError(400, "Your passwords are not thesame."));

    const newUser = await User.create({
      name,
      email,
      password,
      confirmPassword,
    });
    const user = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };

    const token = await signToken(user.id);

    res.set("x-auth-token", token).status(201).send({
      status: "success",
      message: "A user was successfully created",
      user,
    });
  })
);

authRoute.post(
  "/login",
  catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password)
      return next(createError(400, "Plese fill in your login details"));

    const user = await User.findOne({ email }).select("+hashedPassword");

    if (!user || !(await user.comparePasswords(password, user.hashedPassword)))
      return next(createError(400, "Invalid credentials"));

    const token = signToken(user._id);

    res.set("x-auth-token", token).status(200).send({
      status: "success",
      message: "Logged in successfully",
    });
  })
);

export { authRoute, validateUser };
