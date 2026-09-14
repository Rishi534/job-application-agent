function JobSearch() {
  const jobs = [
    { company: "TCS", role: "Java Developer", location: "Pune" },
    { company: "Infosys", role: "React Developer", location: "Bangalore" },
    { company: "Cognizant", role: "Software Engineer", location: "Chennai" },
    { company: "Accenture", role: "Full Stack Developer", location: "Hyderabad" }
  ];

  return (
    <main>
      <h1>Job Search</h1>

      <input placeholder="Search jobs..." />

      <div className="jobs">
        {jobs.map((job) => (
          <div className="job-card" key={job.company}>
            <h2>{job.role}</h2>
            <p>{job.company}</p>
            <p>{job.location}</p>
            <button>View Job</button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default JobSearch;