
import { useEffect, useState } from "react";

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSavedJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/saved-jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch saved jobs");
      }

      setSavedJobs(data.savedJobs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this saved job?")) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/saved-jobs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete job");
      }

      setSavedJobs((jobs) => jobs.filter((job) => job._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading saved jobs...</p>;

  return (
    <div>
      <h1>Saved Jobs</h1>
      <p>Your bookmarked job opportunities.</p>

      {error && <p>{error}</p>}

      {savedJobs.length === 0 ? (
        <p>You haven't saved any jobs yet.</p>
      ) : (
        savedJobs.map((job) => (
          <div
            key={job._id}
            style={{
              border: "1px solid #ddd",
              padding: "16px",
              marginBottom: "12px",
              borderRadius: "8px"
            }}
          >
            <h3>{job.role}</h3>
            <p>{job.company}</p>
            <p>{job.location}</p>
            <p>{job.description}</p>

            {job.jobUrl && (
              <a href={job.jobUrl} target="_blank" rel="noreferrer">
                View Job
              </a>
            )}

            <br />

            <button onClick={() => handleDelete(job._id)}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default SavedJobs;
