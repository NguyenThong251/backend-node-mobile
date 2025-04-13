import express from "express";
import "dotenv/config";
import authRoute from "./routers/AuthRoutes.js";
import bookRoute from "./routers/BookRoutes.js";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import job from "./lib/cron.js";

const app = express();
const PORT = process.env.PORT || 5000;

job.start();
app.use(express.json());
app.use(
  cors({
    origin: "*", // Hoặc specify client's IP/port
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/api/auth", authRoute);
app.use("/api/book", bookRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
