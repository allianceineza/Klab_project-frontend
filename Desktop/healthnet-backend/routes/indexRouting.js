import express from "express";
import pharmacyRouter from "./pharmacyPath.js";
import clinicRouter from "./clinicPath.js";
import hospitalRouter from './hospitalPath.js';
import userRouter from "./userPath.js"

const mainRouter=express.Router();
mainRouter.use("/pharmacy",pharmacyRouter)
mainRouter.use("/clinic",clinicRouter)
mainRouter.use("/hospital",hospitalRouter)
mainRouter.use("/user",userRouter)
export default mainRouter;