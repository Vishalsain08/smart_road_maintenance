import Complaint from "../models/Complaint.js";

// Returns all complaints for the admin dashboard.
export const getAllComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find()
      .populate("reportedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    next(error);
  }
};

// Updates the status of a complaint.
export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["pending", "resolved"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Status must be pending or resolved",
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = status;
    complaint.resolvedAt = status === "resolved" ? complaint.resolvedAt || new Date() : undefined;

    const updatedComplaint = await complaint.save();

    res.status(200).json({
      message: "Complaint status updated successfully",
      complaint: updatedComplaint,
    });
  } catch (error) {
    next(error);
  }
};

// Deletes a complaint by ID.
export const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    await complaint.deleteOne();

    res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    next(error);
  }
};
