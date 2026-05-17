import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// Uploads a local file to Cloudinary and removes it locally afterward.
const uploadToCloudinary = async (
  filePath,
  folder = "smart-road-maintenance"
) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
    });

    // Remove local uploaded file after Cloudinary upload
    fs.unlinkSync(filePath);

    return result;
  } catch (error) {
    // Remove local file even if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    throw error;
  }
};

export default uploadToCloudinary;