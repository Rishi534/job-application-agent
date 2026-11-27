
const mongoose = require("mongoose");

const savedJobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
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
      default: ""
    },
    jobUrl: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

savedJobSchema.index(
  { userId: 1, jobUrl: 1 },
  { unique: true, partialFilterExpression: { jobUrl: { $type: "string", $gt: "" } } }
);

module.exports = mongoose.model("SavedJob", savedJobSchema);
