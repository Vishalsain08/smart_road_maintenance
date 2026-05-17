import express from "express";
import {
  assignEngineer,
  createEngineer,
  deleteComplaint,
  deleteEngineer,
  getAllComplaints,
  getEngineers,
  updateComplaintStatus,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

// Admin routes for managing complaints and assignments.
const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/complaints", getAllComplaints);
router.get("/engineers", getEngineers);
router.post("/engineers", createEngineer);
router.delete("/engineers/:id", deleteEngineer);
router.patch("/assign/:id", assignEngineer);
router.patch("/status/:id", updateComplaintStatus);
router.delete("/complaints/:id", deleteComplaint);

export default router;
