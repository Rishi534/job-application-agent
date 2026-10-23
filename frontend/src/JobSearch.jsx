import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function JobSearch() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data));
  }, []);

  return (
    <main>
      <h1>Find Jobs</h1>

      <div className="jobs">
        {jobs.map((job) => (
          <div className="job-card" key={job.company}>
            <h2>{job.role}</h2>
            <p>{job.company}</p>
            <p>{job.location}</p>
            <p>{job.skills}</p>

            <Link to={`/jobs/${job.company}`}>
              View Job
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}

export default JobSearch;