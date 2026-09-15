const express = require("express");

const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

const PORT = 5000;

// Parse JSON request bodies
app.use(express.json());

// Logging middleware
app.use(logger);

// Middleware to check Content-Type for POST and PUT
app.use((req, res, next) => {
  if (
    (req.method === "POST" || req.method === "PUT") &&
    !req.headers["content-type"]
  ) {
    return res.status(400).json({
      error: "Content-Type header is required",
    });
  }

  next();
});

// Task routes
app.use("/tasks", taskRoutes);

// Custom 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// Global error handler - must be last
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});