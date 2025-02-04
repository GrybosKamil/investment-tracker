import express from "express";
import {
  getInvestments,
  createInvestment,
  deleteInvestment
} from "../controllers/investmentController.js";

const router = express.Router();

router.get("/", getInvestments);
router.post("/", createInvestment);
router.delete("/:id", deleteInvestment);

export const investmentRoutes = router;
