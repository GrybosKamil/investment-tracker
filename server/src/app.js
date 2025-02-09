import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { apiRoutes } from "./routes/apiRoutes.js";

dotenv.config();


const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "../../client/dist")));
app.use("/api", apiRoutes);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI;

const startServer = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    const gracefulShutdown = async () => {
      console.log("Shutting down gracefully...");
      await mongoose.connection.close();
      server.close(() => {
        console.log("Closed out remaining connections.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};

startServer();
