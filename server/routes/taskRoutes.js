
import express from "express";
import mongoose from "mongoose";
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


// GET TASKS WITH FILTERING, SORTING AND PAGINATION
router.get("/", authMiddleware, async (req, res) => {
  try {
    // 1. Pagination
    const page = Math.max(1, parseInt(req.query.page) || 1);

    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit) || 5)
    );

    const skip = (page - 1) * limit;

    // 2. Base filter
    const filter = {
      userId: req.user.userId,
      deletedAt: null,
    };

    // 3. Status filtering
    const { status } = req.query;

    if (status && !["todo", "done", "all", "null"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status filter",
      });
    }

    if (status === "todo" || status === "done") {
      filter.status = status;
    }

    // 4. Sorting selection
    const sortBy = req.query.sortBy || "title";

if (!["title", "createdAt", "title-desc", "createdAt(latest first)"].includes(sortBy)) {
  return res.status(400).json({
    message: "Invalid sorting option",
  });
}

// 5. Sorting order
let sortOptions;

if (sortBy === "title") {
  sortOptions = { title: 1, _id: 1 }; // A to Z
} else if (sortBy === "title-desc") {
  sortOptions = { title: -1, _id: -1 }; // Z to A
} else if (sortBy === "createdAt(latest first)") {
  sortOptions = { createdAt: -1, _id: -1 }; 
} else {
  sortOptions = { createdAt: 1, _id: 1 };
}

    // 6. Fetch tasks
    const tasks = await Task.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // 7. Count matching tasks
    const totalTasks = await Task.countDocuments(filter);

    // 8. Pagination information
    const totalPages = Math.ceil(totalTasks / limit);

    return res.status(200).json({
      message: "Tasks fetched successfully",
      tasks,
      pagination: {
        currentPage: page,
        totalPages,
        totalTasks,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get tasks error:", error.message);

    return res.status(500).json({
      message: "Server error while fetching tasks",
    });
  }
});


// BULK SOFT DELETE TASKS
router.patch("/bulk/soft-delete", authMiddleware, async (req, res) => {
  try {
    const { ids } = req.body;

    // Validate IDs array
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "Please provide task IDs to delete",
      });
    }

    // Validate individual IDs
    const validIds = ids.every((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (!validIds) {
      return res.status(400).json({
        message: "One or more task IDs are invalid",
      });
    }

    // Soft delete selected tasks belonging to the logged-in user
    const result = await Task.updateMany(
      {
        _id: { $in: ids },
        userId: req.user.userId,
        deletedAt: null,
      },
      {
        $set: { deletedAt: new Date() },
      }
    );

    return res.status(200).json({
      message: "Selected tasks deleted successfully",
      deletedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Bulk delete error:", error.message);

    return res.status(500).json({
      message: "Server error while deleting selected tasks",
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

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    // if(status === "done") {
    //   return res.status(400).json({
    //     message: "Already marked as done",
    //   });
    // }
    
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
