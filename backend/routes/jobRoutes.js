const express = require("express");
const axios = require("axios");
const User = require("../models/User");
const verifyUserToken = require("../middleware/authMiddleware");

const router = express.Router();

// Helper: Rule-based recommendation scorer (0 to 100%)
function calculateMatchScore(job, user) {
  if (!user) return { matchScore: 0, matchedSkills: [] };

  const userSkills = (user.skills || []).map((s) => s.toLowerCase().trim());
  const jobText = `${job.role} ${job.skills} ${job.description}`.toLowerCase();

  const matchedSkills = userSkills.filter(
    (skill) => skill && jobText.includes(skill)
  );

  let score = 0;
  if (userSkills.length > 0) {
    score += Math.round((matchedSkills.length / userSkills.length) * 70);
  }
  if (
    user.preferredRole &&
    job.role.toLowerCase().includes(user.preferredRole.toLowerCase())
  ) {
    score += 20;
  }
  if (
    user.preferredLocation &&
    job.location.toLowerCase().includes(user.preferredLocation.toLowerCase())
  ) {
    score += 10;
  }

  return {
    matchScore: Math.min(score, 100),
    matchedSkills
  };
}

// GET /api/jobs?search=react&location=india
router.get("/", verifyUserToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const searchQuery =
      req.query.search?.trim() || user?.preferredRole || "software developer";
    const locationQuery = req.query.location?.trim().toLowerCase() || "";

    const response = await axios.get("https://remotive.com/api/remote-jobs", {
      params: { search: searchQuery, limit: 25 }
    });

    let jobs = (response.data.jobs || []).map((item) => {
      const cleanDescription = (item.description || "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 220);

      const normalizedJob = {
        externalId: item.id,
        company: item.company_name,
        role: item.title,
        location: item.candidate_required_location || "Remote",
        skills: Array.isArray(item.tags) ? item.tags.join(", ") : "",
        jobUrl: item.url,
        description: cleanDescription ? `${cleanDescription}...` : ""
      };

      const { matchScore, matchedSkills } = calculateMatchScore(
        normalizedJob,
        user
      );

      return {
        ...normalizedJob,
        matchScore,
        matchedSkills
      };
    });

    if (locationQuery) {
      jobs = jobs.filter((job) => {
        const loc = job.location.toLowerCase();
        if (locationQuery === "india") {
          return (
            loc.includes("india") ||
            loc.includes("worldwide") ||
            loc.includes("anywhere") ||
            loc.includes("apac")
          );
        }
        return loc.includes(locationQuery);
      });
    }

    // Sort highest-matching recommended jobs first
    jobs.sort((a, b) => b.matchScore - a.matchScore);

    return res.status(200).json(jobs);
  } catch (error) {
    console.error("Fetching external jobs failed:", error.message);
    return res.status(500).json({
      message: "Unable to fetch external job listings"
    });
  }
});

module.exports = router;