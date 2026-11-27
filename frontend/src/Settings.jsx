import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Settings() {
  const [form, setForm] = useState({ name: "", email: "", skills: "", preferredRole: "", preferredLocation: "" });
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const requestProfile = async (method = "GET", body = null) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const res = await fetch("http://localhost:5000/api/users/profile", {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      ...(body && { body: JSON.stringify(body) })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data.user;
  };

  useEffect(() => {
    requestProfile()
      .then((u) => u && setForm({ ...u, skills: (u.skills || []).join(", ") }))
      .catch((err) => setStatus(err.message));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await requestProfile("PUT", {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean)
      });
      setStatus("Preferences saved!");
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <main style={{ padding: "24px", maxWidth: "480px" }}>
      <h1>Settings</h1>
      {status && <p>{status}</p>}
      <form onSubmit={handleSave}>
        <p><strong>{form.name}</strong> ({form.email})</p>
        {[
          ["skills", "Skills (comma-separated)", "React, Node.js, MongoDB"],
          ["preferredRole", "Preferred Role", "Full Stack Developer"],
          ["preferredLocation", "Preferred Location", "India or Remote"]
        ].map(([key, label, placeholder]) => (
          <div key={key} style={{ marginBottom: "10px" }}>
            <label>{label}</label>
            <input
              value={form[key]}
              placeholder={placeholder}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
        ))}
        <button type="submit">Save Preferences</button>
        <button type="button" onClick={() => { localStorage.removeItem("token"); navigate("/login"); }} style={{ marginLeft: "10px" }}>
          Logout
        </button>
      </form>
    </main>
  );
}

export default Settings;