import express from "express";
import {
  deleteComplaint,
  getAllComplaints,
  updateComplaintStatus,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

// Admin routes for managing complaints.
const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/complaints", getAllComplaints);
router.patch("/status/:id", updateComplaintStatus);
router.delete("/complaints/:id", deleteComplaint);

export default router;
