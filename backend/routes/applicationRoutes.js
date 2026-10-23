
const express = require("express");
const Application = require("../models/Application");
const verifyUserToken = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

const applicationRouter = express.Router();

// Save a job application
applicationRouter.post("/", verifyUserToken, async (req, res) => {
  try {
    const { company, role, location, jobUrl, notes, status } = req.body || {};

    if (!company || !role) {
      return res.status(400).json({
        message: "Company and role are required"
      });
    }

    const allowedStatuses = [
      "Applied",
      "In Progress",
      "Interview",
      "Offer",
      "Rejected"
    ];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status"
      });
    }

    const savedApplication = await Application.create({
      userId: req.user.userId,
      company: company.trim(),
      role: role.trim(),
      location,
      jobUrl,
      notes,
      status
    });

    return res.status(201).json({
      message: "Job application saved successfully",
      application: savedApplication
    });
  } catch (applicationError) {
    console.error("Saving application failed:", applicationError.message);

    return res.status(500).json({
      message: "Unable to save job application"
    });
  }
});




applicationRouter.get("/", verifyUserToken, async (req, res) => {
  try {
    const userApplications = await Application.find({
      userId: req.user.userId
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      count: userApplications.length,
      applications: userApplications
    });
  } catch (applicationError) {
    console.error(
      "Fetching applications failed:",
      applicationError.message
    );

    return res.status(500).json({
      message: "Unable to fetch job applications"
    });
  }
});


applicationRouter.put("/:applicationId", verifyUserToken, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, notes } = req.body || {};

    if (!mongoose.isValidObjectId(applicationId)) {
      return res.status(400).json({
        message: "Invalid application ID"
      });
    }

    const allowedStatuses = [
      "Applied",
      "In Progress",
      "Interview",
      "Offer",
      "Rejected"
    ];

    const updates = {};

    if (status !== undefined) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid application status"
        });
      }

      updates.status = status;
    }

    if (notes !== undefined) {
      if (typeof notes !== "string") {
        return res.status(400).json({
          message: "Notes must be text"
        });
      }

      updates.notes = notes;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Provide a status or notes to update"
      });
    }

    const updatedApplication = await Application.findOneAndUpdate(
      {
        _id: applicationId,
        userId: req.user.userId
      },
      { $set: updates },
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    return res.status(200).json({
      message: "Application updated successfully",
      application: updatedApplication
    });
  } catch (updateError) {
    console.error("Updating application failed:", updateError.message);

    return res.status(500).json({
      message: "Unable to update application"
    });
  }
});


applicationRouter.delete("/:applicationId", verifyUserToken, async (req, res) => {
  try {
    const { applicationId } = req.params;

    if (!mongoose.isValidObjectId(applicationId)) {
      return res.status(400).json({
        message: "Invalid application ID"
      });
    }

    const deletedApplication = await Application.findOneAndDelete({
      _id: applicationId,
      userId: req.user.userId
    });

    if (!deletedApplication) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    return res.status(200).json({
      message: "Application deleted successfully"
    });
  } catch (deleteError) {
    console.error("Deleting application failed:", deleteError.message);

    return res.status(500).json({
      message: "Unable to delete job application"
    });
  }
});


module.exports = applicationRouter;