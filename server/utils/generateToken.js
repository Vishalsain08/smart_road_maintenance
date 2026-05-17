import jwt from "jsonwebtoken";

// Creates a JWT for authenticated users.
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "temporary_secret", {
    expiresIn: "30d",
  });
};

export default generateToken;
