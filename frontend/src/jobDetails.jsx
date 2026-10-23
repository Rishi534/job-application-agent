import { useParams, useNavigate } from "react-router-dom";

function JobDetails() {
  const { company } = useParams();
  const navigate = useNavigate();

  function applyJob() {
    alert(`Applied to ${company}`);
    navigate("/dashboard");
  }

  return (
    <main>
      <h1>Software Engineer</h1>
      <h2>{company}</h2>

      <p>📍 Chennai</p>

      <h3>Required Skills</h3>
      <p>Java, SQL, React</p>

      <h3>Job Description</h3>
      <p>
        We are looking for a software engineer to build and maintain
        modern applications.
      </p>

      <button onClick={applyJob}>Apply Now</button>
    </main>
  );
}

export default JobDetails;