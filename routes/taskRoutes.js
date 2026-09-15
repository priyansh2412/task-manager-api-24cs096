const express = require("express");

const router = express.Router();

// In-memory task data
let tasks = [
  {
    id: 1,
    title: "Complete React Practical",
    completed: true,
  },
  {
    id: 2,
    title: "Build Express API",
    completed: false,
  },
];

// GET /tasks
// Get all tasks
router.get("/", (req, res) => {
  res.status(200).json(tasks);
});

// POST /tasks
// Create a new task
router.post("/", (req, res) => {
  const { title, completed } = req.body;

  if (!title) {
    return res.status(400).json({
      error: "Title is required",
    });
  }

  const newTask = {
    id: tasks.length > 0
      ? Math.max(...tasks.map((task) => task.id)) + 1
      : 1,
    title: title,
    completed: completed ?? false,
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

// PUT /tasks/:id
// Update an existing task
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  const { title, completed } = req.body;

  if (title !== undefined) {
    task.title = title;
  }

  if (completed !== undefined) {
    task.completed = completed;
  }

  res.status(200).json(task);
});

// DELETE /tasks/:id
// Delete a task
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];

  res.status(200).json({
    message: "Task deleted successfully",
    task: deletedTask,
  });
});

module.exports = router;