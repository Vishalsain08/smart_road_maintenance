// Handles requests to routes that do not exist.
const notFoundMiddleware = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

export default notFoundMiddleware;
