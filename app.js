require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const aiRoutes = require("./routes/aiRoutes");
const cors = require("cors");
const app = express();
const logger = require("./middleware/logger");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
require("./listeners");
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));



// ==========================
// Middleware
// ==========================

app.use(express.json());

app.use(logger);


// ==========================
// MongoDB Connection
// ==========================



// ==========================
// Routes
// ==========================
app.use("/api/ai", aiRoutes);
app.use("/auth", authRoutes);

app.use("/tasks", taskRoutes);


// ==========================
// Server
// ==========================

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB Connected");
      app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("MongoDB Connection Error:", error);
      process.exit(1);
    });
}


module.exports = app;