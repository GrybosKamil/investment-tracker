import express from "express";
import {
  addInvestmentType,
  deleteInvestmentType,
  listInvestmentTypes,
} from "../controllers/investmentController.js";

const router = express.Router();

router.get("/", listInvestmentTypes);
router.post("/", addInvestmentType);
router.delete("/:id", deleteInvestmentType);

export const investmentTypeRoutes = router;