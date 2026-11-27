import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please log in to view your dashboard.");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`
        };

        const [appsResponse, savedResponse] = await Promise.all([
          fetch("http://localhost:5000/api/applications", { headers }),
          fetch("http://localhost:5000/api/saved-jobs", { headers })
        ]);

        const appsData = await appsResponse.json();
        const savedData = await savedResponse.json();

        if (!appsResponse.ok) {
          throw new Error(appsData.message || "Failed to fetch applications");
        }

        if (!savedResponse.ok) {
          throw new Error(savedData.message || "Failed to fetch saved jobs");
        }

        setApplications(appsData.applications || []);
        setSavedJobsCount(
          typeof savedData.count === "number"
            ? savedData.count
            : (savedData.savedJobs || []).length
        );
      } catch (err) {
        setError(err.message || "Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const interviewCount = applications.filter(
    (app) => app.status === "Interview"
  ).length;

  const recentApplications = applications.slice(0, 3);

  return (
    <div className="dashboard">
      <aside>
        <h2>Job Agent</h2>

        <nav>
          <Link to="/dashboard">▣ Dashboard</Link>
          <Link to="/applications">▤ My Applications</Link>
          <Link to="/jobs">⌕ Job Search</Link>
          <Link to="/saved-jobs">♡ Saved Jobs</Link>
          <Link to="/settings">⚙ Settings</Link>
        </nav>
      </aside>

      <main>
        <h1>Dashboard</h1>
        <p>Track your job applications in one place.</p>

        <div className="cards">
          <div>
            <h3>Jobs Applied</h3>
            <strong>{loading ? "..." : applications.length}</strong>
          </div>

          <div>
            <h3>Interviews</h3>
            <strong>{loading ? "..." : interviewCount}</strong>
          </div>

          <div>
            <h3>Saved Jobs</h3>
            <strong>{loading ? "..." : savedJobsCount}</strong>
          </div>
        </div>

        <section>
          <h2>Recent Applications</h2>

          {loading && <p>Loading applications...</p>}

          {!loading && error && <p>{error}</p>}

          {!loading && !error && applications.length === 0 && (
            <p>No applications yet. Add your first job application!</p>
          )}

          {!loading &&
            !error &&
            recentApplications.map((app) => (
              <p key={app._id}>
                {app.company} — {app.role} — {app.status}
              </p>
            ))}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;