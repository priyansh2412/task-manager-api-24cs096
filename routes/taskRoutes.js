
const express = require("express");
const router = express.Router();
const app = express();
const Task = require("../models/Task");
const cache = require("../utils/cache");
const authenticate = require("../middleware/authMiddleware");

const CACHE_TTL = 60;

const cacheStats = {
  hits: 0,
  misses: 0
};

// Cache statistics endpoint
router.get("/debug/cache", authenticate, (req, res) => {
  res.status(200).json({
    hits: cacheStats.hits,
    misses: cacheStats.misses,
    keys: cache.keys(),
    keyCount: cache.keys().length,
    ttlSeconds: CACHE_TTL
  });
});

// GET all tasks (cached for 60 seconds)
router.get("/", authenticate, async (req, res) => {
  try {
    const cachedTasks = cache.get("all_tasks");

    if (cachedTasks !== undefined) {
      cacheStats.hits++;
      return res.status(200).json(cachedTasks);
    }

    cacheStats.misses++;

    const tasks = await Task.find().lean();

    cache.set("all_tasks", tasks, CACHE_TTL);

    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message
    });
  }
});

// GET one task by MongoDB ID (cached for 60 seconds)
router.get("/:id", authenticate, async (req, res) => {
  try {
    const id = req.params.id;

    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const cacheKey = `task_${id}`;
    const cachedTask = cache.get(cacheKey);

    if (cachedTask !== undefined) {
      cacheStats.hits++;
      return res.status(200).json(cachedTask);
    }

    cacheStats.misses++;

    const task = await Task.findById(id).lean();

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    cache.set(cacheKey, task, CACHE_TTL);

    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch task",
      error: error.message
    });
  }
});

// CREATE a task
router.post("/", authenticate, async (req, res) => {
  try {
    const { title, description, completed, priority } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required"
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      completed,
      priority
    });

    cache.del("all_tasks");

    return res.status(201).json({
      message: "Task created successfully",
      task
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to create task",
      error: error.message
    });
  }
});

// UPDATE a task
router.put("/:id", authenticate, async (req, res) => {
  try {
    const id = req.params.id;

    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const { title, description, completed, priority } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required"
      });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        description,
        completed,
        priority
      },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    cache.del(["all_tasks", `task_${id}`]);

    return res.status(200).json({
      message: "Task updated successfully",
      task
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to update task",
      error: error.message
    });
  }
});

// DELETE a task
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const id = req.params.id;

    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    cache.del(["all_tasks", `task_${id}`]);

    return res.status(200).json({
      message: "Task deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete task",
      error: error.message
    });
  }
});

module.exports = router;
