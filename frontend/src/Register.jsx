import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    skills: "",
    preferredRole: "",
    preferredLocation: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean)
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    ["name", "Full Name", "text", "Your name", true],
    ["email", "Email", "email", "you@example.com", true],
    ["password", "Password (min 8 chars)", "password", "••••••••", true],
    ["skills", "Skills (comma-separated)", "text", "React, Node.js, MongoDB", false],
    ["preferredRole", "Preferred Role", "text", "Full Stack Developer", false],
    ["preferredLocation", "Preferred Location", "text", "India or Remote", false]
  ];

  return (
    <main style={{ padding: "24px", maxWidth: "420px", margin: "40px auto" }}>
      <h1>Create Account</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {fields.map(([key, label, type, placeholder, required]) => (
          <div key={key} style={{ marginBottom: "12px" }}>
            <label>{label}</label>
            <input
              type={type}
              required={required}
              value={form[key]}
              placeholder={placeholder}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            />
          </div>
        ))}

        <button type="submit" disabled={loading} style={{ width: "100%", padding: "10px" }}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p style={{ marginTop: "14px" }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </main>
  );
}

export default Register;