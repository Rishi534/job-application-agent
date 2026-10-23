require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const verifyUserToken = require("./middleware/authMiddleware");
const applicationRouter = require("./routes/applicationRoutes");

const jobRoutes = require("./routes/jobRoutes");
const userRegistrationRouter = require("./routes/userRoutes");

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRegistrationRouter);
app.use("/api/applications", applicationRouter);

app.get("/api/users/profile", verifyUserToken, (req, res) => {
  res.status(200).json({
    message: "Authentication successful",
    userId: req.user.userId
  });
});

app.get("/", (req, res) => {
  res.send("Job Agent Backend is running");
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();