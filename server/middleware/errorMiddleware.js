// Sends a clear JSON response for unexpected server errors.
const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  res.status(statusCode).json({
    message: err.message || "Server error",
  });
};

export default errorMiddleware;
