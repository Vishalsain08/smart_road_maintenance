import Complaint from "../models/Complaint.js";
import User from "../models/User.js";

// Returns all complaints for the admin dashboard.
export const getAllComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find()
      .populate("reportedBy", "name email role")
      .populate("assignedEngineer", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    next(error);
  }
};

// Returns all engineers for assignment dropdowns.
export const getEngineers = async (req, res, next) => {
  try {
    const engineers = await User.find({ role: "engineer" })
      .select("name email role")
      .sort({ name: 1 });

    const complaints = await Complaint.find({
      assignedEngineer: { $in: engineers.map((engineer) => engineer._id) },
    }).select("assignedEngineer status");

    const engineersWithStats = engineers.map((engineer) => {
      const engineerComplaints = complaints.filter(
        (complaint) =>
          complaint.assignedEngineer?.toString() === engineer._id.toString()
      );

      return {
        _id: engineer._id,
        name: engineer.name,
        email: engineer.email,
        role: engineer.role,
        assignedComplaintsCount: engineerComplaints.length,
        resolvedComplaintsCount: engineerComplaints.filter(
          (complaint) => complaint.status === "resolved"
        ).length,
      };
    });

    res.status(200).json({
      success: true,
      count: engineersWithStats.length,
      engineers: engineersWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// Creates an engineer account.
export const createEngineer = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const normalizedEmail = email.toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const engineer = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: "engineer",
    });

    res.status(201).json({
      success: true,
      message: "Engineer created successfully",
      engineer: {
        _id: engineer._id,
        name: engineer.name,
        email: engineer.email,
        role: engineer.role,
        assignedComplaintsCount: 0,
        resolvedComplaintsCount: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Deletes an engineer account and unassigns active complaints.
export const deleteEngineer = async (req, res, next) => {
  try {
    const engineer = await User.findOne({
      _id: req.params.id,
      role: "engineer",
    });

    if (!engineer) {
      return res.status(404).json({ message: "Engineer not found" });
    }

    await Complaint.updateMany(
      { assignedEngineer: engineer._id, status: { $ne: "resolved" } },
      { $set: { assignedEngineer: null, status: "pending" } }
    );

    await engineer.deleteOne();

    res.status(200).json({ message: "Engineer deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Assigns an engineer to a complaint and starts work.
export const assignEngineer = async (req, res, next) => {
  try {
    const { engineerId } = req.body;

    if (!engineerId) {
      return res.status(400).json({ message: "Please select an engineer" });
    }

    const engineer = await User.findOne({
      _id: engineerId,
      role: "engineer",
    });

    if (!engineer) {
      return res.status(404).json({ message: "Engineer not found" });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.assignedEngineer = engineerId;
    complaint.status = "in-progress";

    const updatedComplaint = await complaint.save();
    await updatedComplaint.populate("assignedEngineer", "name email role");
    await updatedComplaint.populate("reportedBy", "name email role");

    res.status(200).json({
      message: "Engineer assigned successfully",
      complaint: updatedComplaint,
    });
  } catch (error) {
    next(error);
  }
};

// Updates the status of a complaint.
export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["pending", "in-progress", "resolved"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Status must be pending, in-progress, or resolved",
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = status;

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
