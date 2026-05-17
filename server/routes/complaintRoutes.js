import express from "express";

import {
  createComplaint,
  getComplaintById,
  getMyComplaints,
} from "../controllers/complaintController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

import upload from "../middleware/multerMiddleware.js";

// Complaint routes for road issue reports.
const router = express.Router();

// All complaint routes require authentication
router.use(protect);

// Create complaint with image upload
router.post(
  "/",
  authorizeRoles("citizen"),
  upload.single("image"),
  createComplaint
);

// Get logged-in user's complaints
router.get("/my", getMyComplaints);

// Get single complaint details
router.get("/:id", getComplaintById);

export default router;