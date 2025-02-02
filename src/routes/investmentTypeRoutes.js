import express from "express";
import {
  addInvestmentType,
  listInvestmentTypes,
} from "../controllers/investmentController.js";

const router = express.Router();

router.get("/", listInvestmentTypes);
router.post("/", addInvestmentType);

export const investmentTypeRoutes = router;