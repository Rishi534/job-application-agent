const express = require("express");

const router = express.Router();

router.get("/", (req,res) => {
  res.json([
    {
      company: "Cognizant",
      role: "Software Engineer",
      location: "Chennai",
      skills: "Java, SQL, React"
    },
    {
      company: "TCS",
      role: "Java Developer",
      location: "Pune",
      skills: "Java,Spring Boot, SQL"
    }
  ]);
});

module.exports = router;