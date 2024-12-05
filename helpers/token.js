import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

const { SECRET_KEY, EXPIRES_IN } = process.env;

function signToken(userId) {
  return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: EXPIRES_IN });
}

function decodeToken(token) {
  return jwt.verify(token, SECRET_KEY);
}

export { signToken, decodeToken };
