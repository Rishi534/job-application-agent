
const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    company: {
      type: String,
      required: true,
      trim: true
    },

    role: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      default: "Not specified",
      trim: true
    },

    status: {
      type: String,
      enum: [
        "Applied",
        "In Progress",
        "Interview",
        "Offer",
        "Rejected"
      ],
      default: "Applied"
    },

    jobUrl: {
      type: String,
      default: ""
    },

    notes: {
      type: String,
      default: ""
    },

    appliedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Application",
  jobApplicationSchema
);
