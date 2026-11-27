
const express = require("express");
const mongoose = require("mongoose");
const SavedJob = require("../models/SavedJob");
const verifyUserToken = require("../middleware/authMiddleware");

const savedJobRouter = express.Router();

console.log("Saved Jobs routes loaded");

// Save a job
savedJobRouter.post("/", verifyUserToken, async (req, res) => {
  try {
    const { company, role, location, jobUrl, description } = req.body || {};

    if (
      typeof company !== "string" ||
      !company.trim() ||
      typeof role !== "string" ||
      !role.trim()
    ) {
      return res.status(400).json({
        message: "Company and role are required"
      });
    }

    const normalizedJobUrl =
      typeof jobUrl === "string" ? jobUrl.trim() : "";

    if (normalizedJobUrl) {
      let parsedUrl;

      try {
        parsedUrl = new URL(normalizedJobUrl);
      } catch {
        return res.status(400).json({
          message: "Invalid job URL"
        });
      }

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        return res.status(400).json({
          message: "Job URL must use HTTP or HTTPS"
        });
      }
    }

    const savedJob = await SavedJob.create({
      userId: req.user.userId,
      company: company.trim(),
      role: role.trim(),
      location: typeof location === "string" ? location.trim() : "",
      jobUrl: normalizedJobUrl,
      description:
        typeof description === "string" ? description.trim() : ""
    });

    return res.status(201).json({
      message: "Job saved successfully",
      savedJob
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You have already saved this job"
      });
    }

    console.error("Saving job failed:", error.message);

    return res.status(500).json({
      message: "Unable to save job"
    });
  }
});

// Get the logged-in user's saved jobs
savedJobRouter.get("/", verifyUserToken, async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({
      userId: req.user.userId
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      count: savedJobs.length,
      savedJobs
    });
  } catch (error) {
    console.error("Fetching saved jobs failed:", error.message);

    return res.status(500).json({
      message: "Unable to fetch saved jobs"
    });
  }
});

// Remove a saved job
savedJobRouter.delete("/:savedJobId", verifyUserToken, async (req, res) => {
  try {
    const { savedJobId } = req.params;

    if (!mongoose.isValidObjectId(savedJobId)) {
      return res.status(400).json({
        message: "Invalid saved job ID"
      });
    }

    const deletedJob = await SavedJob.findOneAndDelete({
      _id: savedJobId,
      userId: req.user.userId
    });

    if (!deletedJob) {
      return res.status(404).json({
        message: "Saved job not found"
      });
    }

    return res.status(200).json({
      message: "Saved job removed successfully"
    });
  } catch (error) {
    console.error("Deleting saved job failed:", error.message);

    return res.status(500).json({
      message: "Unable to remove saved job"
    });
  }
});

module.exports = savedJobRouter;
