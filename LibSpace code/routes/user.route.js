import express from "express";
import userController from "../controller/authController.js";
import { verifyToken } from "../middlewares/verify_token.js";

const userRouter = express.Router();

userRouter.post("/register", userController.registerUser);
userRouter.post("/login", userController.loginUser);
userRouter.post("/logout", verifyToken, userController.logoutUser);
userRouter.delete("/:userId", verifyToken, userController.deleteUser);

export default userRouter;