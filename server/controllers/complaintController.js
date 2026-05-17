import Complaint from "../models/Complaint.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

// Converts multipart form location data into the shape required by the schema.
const parseLocation = (location, lat, lng) => {
  if (location && typeof location === "object") {
    return location;
  }

  if (location && typeof location === "string") {
    try {
      return JSON.parse(location);
    } catch (error) {
      const invalidLocationError = new Error("Location must be valid JSON with lat and lng");
      invalidLocationError.statusCode = 400;
      throw invalidLocationError;
    }
  }

  if (lat && lng) {
    return {
      lat: Number(lat),
      lng: Number(lng),
    };
  }

  return null;
};

// Creates a new complaint for the logged-in citizen.
export const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, location, lat, lng } = req.body;
    const parsedLocation = parseLocation(location, lat, lng);

    // Validate required fields.
    if (!title || !description || !category || !parsedLocation) {
      return res.status(400).json({
        message: "Please provide title, description, category, and location",
      });
    }

    // Ensure an image was uploaded by multer.
    if (!req.file) {
      return res.status(400).json({
        message: "Complaint image is required",
      });
    }

    // Upload the local multer file to Cloudinary.
    const result = await uploadToCloudinary(req.file.path, "road-maintenance/complaints");

    // Save the complaint with the Cloudinary image URL.
    const complaint = await Complaint.create({
      title,
      description,
      category,
      image: result.secure_url,
      location: parsedLocation,
      reportedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Complaint created successfully",
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// Returns complaints created by logged-in user.
export const getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({
      reportedBy: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

// Returns one complaint by ID with role-based access control.
export const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("reportedBy", "name email")
      .populate("assignedEngineer", "name email");

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    const userRole = req.user.role;

    // Citizens can only view their own complaints.
    if (
      userRole === "citizen" &&
      complaint.reportedBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // Engineers can only view assigned complaints.
    if (
      userRole === "engineer" &&
      complaint.assignedEngineer?._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    next(error);
  }
};
