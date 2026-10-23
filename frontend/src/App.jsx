import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import JobSearch from "./JobSearch";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/jobs" element={<JobSearch />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;