import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function JobSearch() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingJob, setSavingJob] = useState(null);
  const [applyingJob, setApplyingJob] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 1. Fetch personalized live jobs with JWT token and optional filters
  const fetchJobs = async (searchQuery = "", locationQuery = "") => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in to view recommended jobs.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      if (locationQuery.trim()) params.append("location", locationQuery.trim());

      const queryString = params.toString();
      const url = `http://localhost:5000/api/jobs${
        queryString ? `?${queryString}` : ""
      }`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to load jobs");
      }

      setJobs(Array.isArray(data) ? data : data.jobs || []);
    } catch (err) {
      setError(err.message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs(search, location);
  };

  // 2. Save job to /api/saved-jobs
  const handleSaveJob = async (job) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in to save jobs.");
      return;
    }

    const jobKey = job.externalId || `${job.company}-${job.role}`;
    setSavingJob(jobKey);
    setMessage("");
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/saved-jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          company: job.company,
          role: job.role,
          location: job.location || "",
          jobUrl: job.jobUrl || "",
          description: job.description || job.skills || ""
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save job");
      }

      setMessage(`${job.role} at ${job.company} saved successfully!`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingJob(null);
    }
  };

  // 3. Track job directly in /api/applications
  const handleTrackApplication = async (job) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in to track applications.");
      return;
    }

    const jobKey = job.externalId || `${job.company}-${job.role}`;
    setApplyingJob(jobKey);
    setMessage("");
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          company: job.company,
          role: job.role,
          location: job.location || "",
          jobUrl: job.jobUrl || "",
          status: "Applied",
          notes: job.matchedSkills?.length
            ? `Matched skills: ${job.matchedSkills.join(", ")}`
            : ""
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to record application");
      }

      setMessage(`Added ${job.role} at ${job.company} to Applications!`);
    } catch (err) {
      setError(err.message);
    } finally {
      setApplyingJob(null);
    }
  };

  return (
    <main>
      <h1>Find Jobs</h1>

      {/* Search & Location Filter Form */}
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Role or skill (e.g. React, Node, Java)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location (e.g. India, Worldwide, USA)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}
      {loading && <p>Loading live job recommendations...</p>}

      {!loading && jobs.length === 0 && !error && (
        <p>No jobs found. Try a different keyword or location.</p>
      )}

      <div className="jobs">
        {jobs.map((job) => {
          const jobKey = job.externalId || `${job.company}-${job.role}`;

          return (
            <div className="job-card" key={jobKey}>
              <div className="job-header">
                <h2>{job.role}</h2>
                {typeof job.matchScore === "number" && (
                  <span className="match-badge">
                    {job.matchScore}% Match
                  </span>
                )}
              </div>

              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Location:</strong> {job.location}</p>

              {job.matchedSkills && job.matchedSkills.length > 0 && (
                <p className="matched-skills">
                  <strong>Matched Skills:</strong> {job.matchedSkills.join(", ")}
                </p>
              )}

              {job.skills && <p><strong>Tags:</strong> {job.skills}</p>}
              {job.description && <p>{job.description}</p>}

              <div className="job-actions">
                {job.jobUrl ? (
                  <a
                    href={job.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Apply on Site
                  </a>
                ) : (
                  <Link to={`/jobs/${encodeURIComponent(job.company)}`}>
                    View Job
                  </Link>
                )}

                <button
                  onClick={() => handleSaveJob(job)}
                  disabled={savingJob === jobKey}
                >
                  {savingJob === jobKey ? "Saving..." : "Save Job"}
                </button>

                <button
                  onClick={() => handleTrackApplication(job)}
                  disabled={applyingJob === jobKey}
                >
                  {applyingJob === jobKey ? "Adding..." : "Mark Applied"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default JobSearch;