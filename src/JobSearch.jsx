function JobSearch() {
  const jobs = [
    {
      company: "Cognizant",
      role: "Software Engineer",
      location: "Chennai",
      skills: "Java, SQL, React",
    },
    {
      company: "TCS",
      role: "Java Developer",
      location: "Pune",
      skills: "Java, Spring Boot, SQL",
    },
    {
      company: "Infosys",
      role: "React Developer",
      location: "Bangalore",
      skills: "React, JavaScript, Node",
    },
  ];

  return (
    <main>
      <h1>Find Jobs</h1>

      <div className="search">
        <input placeholder="Job title or skill" />
        <input placeholder="Location" />
        <button>Search</button>
      </div>

      <div className="jobs">
        {jobs.map((job) => (
          <div className="job-card" key={job.company}>
            <h2>{job.role}</h2>
            <p>{job.company}</p>
            <p>{job.location}</p>
            <p>{job.skills}</p>
            <button>View Job</button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default JobSearch;