
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchApplications() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in first.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/applications",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load applications");
      }

      setApplications(data.applications || []);
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  async function updateStatus(id, status) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/applications/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      setApplications((previous) =>
        previous.map((app) =>
          app._id === id ? data.application : app
        )
      );
    } catch (err) {
      setError(err.message || "Unable to update application.");
    }
  }

  async function deleteApplication(id) {
    if (!window.confirm("Delete this job application?")) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/applications/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete application");
      }

      setApplications((previous) =>
        previous.filter((app) => app._id !== id)
      );
    } catch (err) {
      setError(err.message || "Unable to delete application.");
    }
  }

  return (
    <div className="dashboard">
      <aside>
        <h2>Job Agent</h2>
        <nav>
          <Link to="/dashboard">▣ Dashboard</Link>
          <Link to="/applications">▤ My Applications</Link>
          <Link to="/jobs">⌕ Job Search</Link>
          <Link to="/saved">♡ Saved Jobs</Link>
          <Link to="/settings">⚙ Settings</Link>
        </nav>
      </aside>

      <main>
        <h1>My Applications</h1>
        <p>Track and manage your job applications.</p>

        {loading && <p>Loading applications...</p>}
        {error && <p role="alert">{error}</p>}

        {!loading && !error && applications.length === 0 && (
          <p>No applications found. Apply to a job to get started.</p>
        )}

        {!loading && applications.length > 0 && (
          <div className="applications-list">
            {applications.map((app) => (
              <section key={app._id}>
                <h3>{app.company}</h3>
                <p>Role: {app.role}</p>
                <p>Location: {app.location || "Not specified"}</p>

                <label>
                  Status:{" "}
                  <select
                    value={app.status}
                    onChange={(e) =>
                      updateStatus(app._id, e.target.value)
                    }
                  >
                    <option value="Applied">Applied</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </label>

                {app.jobUrl && (
                  <p>
                    <a
                      href={app.jobUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Job
                    </a>
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => deleteApplication(app._id)}
                >
                  Delete
                </button>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Applications;
