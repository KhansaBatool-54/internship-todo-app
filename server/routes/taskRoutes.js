
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
      userId: req.user.userId,
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


// GET ALL TASKS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.user.userId,
      deletedAt: null,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error.message);

    return res.status(500).json({
      message: "Server error while fetching tasks",
    });
  }
});

 // SOFT DELETE TASK
router.patch("/:id/soft-delete", authMiddleware, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
        deletedAt: null,
      },
      {
        deletedAt: new Date(),
      },
      {
        new: true,
      }
    );

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task soft deleted successfully",
      task: deletedTask,
    });
  } catch (error) {
    console.error("Soft delete task error:", error.message);

    return res.status(500).json({
      message: "Server error while deleting task",
    });
  }
});

// UPDATE TASK STATUS
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["todo", "done"].includes(status)) {
      return res.status(400).json({
        message: "Invalid task status",
      });
    }

    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      {
        status: status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task status updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error.message);

    return res.status(500).json({
      message: "Server error while updating task",
    });
  }
});

export default router;
