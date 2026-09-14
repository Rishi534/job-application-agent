import { useState } from "react";
import Dashboard from "./Dashboard";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  function login(e) {
    e.preventDefault();

    if (email && password) {
      setLoggedIn(true);
    }
  }

  if (loggedIn) {
    return <Dashboard />;
  }

  return (
    <div>
      <h1>Job Agent</h1>

      <form onSubmit={login}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button>Login</button>
      </form>
    </div>
  );
}

export default App;