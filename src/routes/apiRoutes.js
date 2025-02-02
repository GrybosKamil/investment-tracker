import express from "express";
import { investmentRoutes } from "./investmentRoutes.js";
import { investmentTypeRoutes } from "./investmentTypeRoutes.js";

const router = express.Router();

router.use("/investment", investmentRoutes);
router.use("/investmentType", investmentTypeRoutes);

export const apiRoutes = router;
