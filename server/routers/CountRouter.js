import express from "express";
import { getCounts, getRevenueByDate } from "../controllers/countController.js";

const CountRouter = express.Router();

// Định nghĩa API đếm số lượng
CountRouter.get("/", getCounts);
CountRouter.get("/revenue", getRevenueByDate);

export default CountRouter;
