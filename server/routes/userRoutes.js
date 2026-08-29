import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getUserData, updateUser } from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.put('/name', userAuth, updateUser);

export default userRouter;
