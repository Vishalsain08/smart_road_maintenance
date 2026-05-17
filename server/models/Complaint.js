import mongoose from "mongoose";

// Defines road maintenance complaints submitted by users.
const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "pothole",
        "road_crack",
        "water_leakage",
        "street_light_issue",
      ],
      required: true,
    },

    image: {
      type: String,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "in-progress",
        "resolved",
      ],
      default: "pending",
      index: true,
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    assignedEngineer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    resolutionImage: {
      type: String,
    },

    resolutionNotes: {
      type: String,
      trim: true,
    },

    resolvedAt: {
      type: Date,
    },

    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;
