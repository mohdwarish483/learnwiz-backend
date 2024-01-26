import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
import { userCollection } from "../models/UserModel.js";
import { catchAsyncError } from "./catchTryMIddleware.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) return next(new ErrorHandler("Not Logged In", 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // decoded token payload , which includes user_id passed at the time of creation , expirty and date of creation

  req.user = await userCollection.findById(decoded?._id); // update request user before going to the actual controller

  next();
});

export const authorizeSubscribers = (req, res, next) => {
  if (req.user.subscription.status !== "active" && req.user.role !== "admin")
    return next(
      new ErrorHandler(`Only Subscribers can acces this resource`, 403)
    );

  next();
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return next(
      new ErrorHandler(
        `${req.user.role} is not allowed to access this resource`,
        403
      )
    );

  next();
};
