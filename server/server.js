import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import engineerRoutes from "./routes/engineerRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import notFoundMiddleware from "./middleware/notFoundMiddleware.js";

// Loads environment variables from .env.
dotenv.config();

const app = express();

// Global middleware.
app.use(cors());
app.use(express.json());

// Default test route.
app.get("/", (req, res) => {
  res.send("Smart Road Maintenance System API is running");
});

// API routes.
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/engineer", engineerRoutes);

// Error handlers.
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is missing. Add it to server/.env before logging in.");
    process.exit(1);
  }

  await connectDB();

  // Starts the Express server only after MongoDB is ready.
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("Admin engineer routes mounted:");
    console.log("GET    /api/admin/engineers");
    console.log("POST   /api/admin/engineers");
    console.log("DELETE /api/admin/engineers/:id");
  });
};

startServer();
