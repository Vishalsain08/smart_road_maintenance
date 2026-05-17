import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// Registers a new user.
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields.
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide all fields",
      });
    }

    // Normalize email.
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists.
    const userExists = await User.findOne({
      email: normalizedEmail,
    });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Create user with default citizen role.
    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: "citizen",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// Logs in an existing user.
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields.
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    // Normalize email.
    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (user && (await user.matchPassword(password))) {
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }

    return res.status(401).json({
      message: "Invalid email or password",
    });
  } catch (error) {
    next(error);
  }
};

// Returns the logged-in user's profile.
export const getUserProfile = async (req, res) => {
  res.status(200).json(req.user);
};
