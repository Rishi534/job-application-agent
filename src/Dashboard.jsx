import { Link } from "react-router-dom";
function Dashboard() {
  return (
    <div className="dashboard">
      <aside>
        <h2>Job Agent</h2>

        <nav>
          <p>▣ Dashboard</p>
          <p>▤ My Applications</p>
          <Link to="/jobs">⌕ Job Search</Link>
          <p>♡ Saved Jobs</p>
          <p>⚙ Settings</p>
        </nav>
      </aside>

      <main>
        <h1>Dashboard</h1>
        <p>Track your job applications in one place.</p>

        <div className="cards">
          <div>
            <h3>Jobs Applied</h3>
            <strong>12</strong>
          </div>

          <div>
            <h3>Interviews</h3>
            <strong>3</strong>
          </div>

          <div>
            <h3>Saved Jobs</h3>
            <strong>8</strong>
          </div>
        </div>

        <section>
          <h2>Recent Applications</h2>

          <p>Google — Software Engineer — Interview</p>
          <p>TCS — Java Developer — Applied</p>
          <p>Infosys — React Developer — Rejected</p>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;