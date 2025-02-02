import express from "express";
import {
  getInvestments,
  createInvestment,
} from "../controllers/investmentController.js";

const router = express.Router();

router.get("/", getInvestments);
router.post("/", createInvestment);

export const investmentRoutes = router;
