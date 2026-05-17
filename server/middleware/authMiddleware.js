import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protects private routes by checking for a valid JWT.
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // The authorization header must look like: Bearer TOKEN
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Get only the token part from the header.
    const token = authHeader.split(" ")[1];

    // Verify the token using the secret stored in .env.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user and remove the password field from the result.
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    // Attach the logged-in user to the request for the next middleware/controller.
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};
