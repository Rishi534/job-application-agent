import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import JobSearch from "./JobSearch";
import Applications from "./Applications";
import SavedJobs from "./SavedJobs";
import Settings from "./Settings";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/jobs" element={<JobSearch />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/saved-jobs" element={<SavedJobs />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;