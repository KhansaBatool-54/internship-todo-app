import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE TASK
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const newTask = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      user: req.user.userId, // authMiddleware se userId mil rahi hai
    });

    return res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    console.error("Create task error:", error.message);
    return res.status(500).json({
      message: "Server error while creating task",
    });
  }
});

export default router;