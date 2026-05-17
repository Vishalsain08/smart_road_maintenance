import express from "express";

import {
  getAssignedComplaints,
  updateEngineerStatus,
  uploadResolutionImage,
} from "../controllers/engineerController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

import upload from "../middleware/multerMiddleware.js";

// Engineer routes for assigned complaints and repair updates.
const router = express.Router();

router.use(protect, authorizeRoles("engineer"));

// Get assigned complaints
router.get("/complaints", getAssignedComplaints);

// Update complaint progress
router.patch("/complaints/:id/status", updateEngineerStatus);

// Upload repair proof and resolve complaint
const resolutionUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "resolutionImage", maxCount: 1 },
]);

router.patch("/complaints/:id/upload", resolutionUpload, uploadResolutionImage);
router.patch("/complaints/:id/resolve", resolutionUpload, uploadResolutionImage);

export default router;
