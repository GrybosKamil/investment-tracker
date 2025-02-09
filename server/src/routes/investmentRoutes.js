import express from "express";
import {
  getInvestments,
  createInvestment,
  deleteInvestment,
  importInvestments,
  singleFileUpload,
  exportInvestments,
} from "../controllers/investmentController.js";

const router = express.Router();

router.get("/", getInvestments);
router.post("/", createInvestment);
router.delete("/:id", deleteInvestment);

router.post("/import", singleFileUpload, importInvestments);
router.get("/export", exportInvestments);

export const investmentRoutes = router;
