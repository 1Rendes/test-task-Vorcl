import createHttpError from "http-errors";
import { UserCollection } from "../db/models/user.js";

export const registerUser = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (user) throw createHttpError(409, "Email in use.");
  return UserCollection.create({ email });
};
