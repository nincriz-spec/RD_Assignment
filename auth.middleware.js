import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", ""); //replace method delete the substring ofstring

    if (!token) {
      throw ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      //next video discuss about frontend
      throw new Error( "Invalid Access Token");
    }

    req.user = user;  //giving user information to the req object.****
    next();
  } catch (error) {
    throw new Error( "Invalid Access Token");
  }
};