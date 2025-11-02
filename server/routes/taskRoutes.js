const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const jwt = require("jsonwebtoken");

// Middleware to check token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // FIXED: expects `id` in JWT
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Get all tasks for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create task
router.post("/", authMiddleware, async (req, res) => {
  const { title } = req.body;
  try {
    const task = new Task({ title, userId: req.userId });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update task (toggle completed)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete task
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: "Task deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;