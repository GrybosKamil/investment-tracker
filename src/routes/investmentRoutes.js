import express from "express";
import {
  getInvestments,
  createInvestment,
  listInvestmentTypes,
  addInvestmentType,
} from "../controllers/investmentController.js";

const router = express.Router();

router.get("/investment", getInvestments);
router.post("/investment", createInvestment);

router.get("/investment-type", listInvestmentTypes);
router.post("/investment-type", addInvestmentType);

export default router;
