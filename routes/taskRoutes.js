const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// GET all tasks
router.get("/", async (req, res, next) => {
  try {
    const tasks = await Task.find();

    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

// GET task by ID
router.get("/:id", async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        error: "Task not found"
      });
    }

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

// POST - Create a new task
router.post("/", async (req, res, next) => {
  try {
    const task = await Task.create(req.body);

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// PUT - Update a task
router.put("/:id", async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!task) {
      return res.status(404).json({
        error: "Task not found"
      });
    }

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

// DELETE - Delete a task
router.delete("/:id", async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        error: "Task not found"
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
      task: task
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;