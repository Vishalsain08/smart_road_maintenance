import Complaint from "../models/Complaint.js";
import cloudinary from "../config/cloudinary.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

const getResolutionFile = (req) =>
  req.file || req.files?.image?.[0] || req.files?.resolutionImage?.[0];

// Returns complaints assigned to logged-in engineer.
export const getAssignedComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({
      assignedEngineer: req.user._id,
    })
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

// Allows engineer to update complaint progress.
export const updateEngineerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["in-progress", "resolved"];

    // Engineers can only use these statuses
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Engineers can only update status to 'in-progress' or 'resolved'",
      });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    // Ensure complaint belongs to engineer
    if (
      complaint.assignedEngineer?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not assigned to this complaint",
      });
    }

    complaint.status = status;

    // Set resolved timestamp
    if (status === "resolved") {
      complaint.resolvedAt = Date.now();
    }

    const updatedComplaint = await complaint.save();

    res.status(200).json({
      success: true,
      message: "Complaint status updated successfully",
      complaint: updatedComplaint,
    });
  } catch (error) {
    next(error);
  }
};

// Uploads repair proof image and resolves complaint.
export const uploadResolutionImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { resolutionNotes } = req.body;
    const resolutionFile = getResolutionFile(req);

    if (!resolutionFile) {
      return res.status(400).json({
        message: "Resolution image is required",
      });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    // Ensure complaint belongs to engineer
    if (
      complaint.assignedEngineer?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not assigned to this complaint",
      });
    }

    // Upload image to Cloudinary
    const result = await uploadToCloudinary(
  resolutionFile.path,
  "road-maintenance/resolutions"
);

    complaint.resolutionImage = result.secure_url;
    complaint.resolutionNotes = resolutionNotes || complaint.resolutionNotes;
    complaint.status = "resolved";
    complaint.resolvedAt = Date.now();

    const updatedComplaint = await complaint.save();

    res.status(200).json({
      success: true,
      message: "Resolution image uploaded successfully",
      complaint: updatedComplaint,
    });
  } catch (error) {
    next(error);
  }
};
