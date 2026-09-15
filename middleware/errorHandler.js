const errorHandler = (err, req, res, next) => {
  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = {};

    for (const field in err.errors) {
      errors[field] = err.errors[field].message;
    }

    return res.status(400).json({
      errors
    });
  }

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  // Other unexpected errors
  console.error(err);

  res.status(500).json({
    error: "Something went wrong"
  });
};

module.exports = errorHandler;