import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { apiRoutes } from "./routes/apiRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "../../client/dist")));

app.use(async (req, res, next) => {
  const dbUri = req.headers["x-database-uri"];
  if (!dbUri) {
    return res.status(400).json({ message: "Database URI is required" });
  }

  try {
    console.log("Connecting to MongoDB", dbUri);
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    next();
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    res.status(500).json({ message: "Error connecting to MongoDB" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use("/api", apiRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});
