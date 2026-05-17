// Allows only users with the listed roles to access a route.
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // req.user is added by authMiddleware after JWT verification.
    const userRole = req.user?.role;

    // If the user's role is not in the allowed roles list, block access.
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied. You are not authorized." });
    }

    // Role matched, so continue to the controller.
    next();
  };
};
