import { useState } from "react";
import "./LoginForm.css";

// ======================================
// EXERCISE 4.1: Integration Testing a Form
// ======================================
// Context: Integration tests check how multiple units work together.
// React Testing Library encourages testing user interactions
// (like clicking and typing) rather than implementation details.

// Mock API function (will be mocked in tests)
export async function loginAPI(email, password) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate validation
  if (email === "test@example.com" && password === "password123") {
    return { success: true, user: { email, name: "Test User" } };
  } else {
    throw new Error("Invalid email or password");
  }
}

export default function LoginForm({ onLogin = loginAPI }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setStatus("error");
      setMessage("Please fill in all fields");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const result = await onLogin(email, password);
      setStatus("success");
      setMessage(`Welcome back, ${result.user.name}!`);
      setUser(result.user);
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  };

  const handleLogout = () => {
    setStatus("idle");
    setMessage("");
    setUser(null);
    setEmail("");
    setPassword("");
  };

  // Show welcome screen if logged in
  if (status === "success" && user) {
    return (
      <div className="login-form-container">
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h2>Welcome back!</h2>
          <p className="welcome-message">{message}</p>
          <div className="user-info">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-form-container">
      <h2>Exercise 4.1: Integration Testing</h2>
      <p className="description">
        This component demonstrates a <code>LoginForm</code> that can be tested
        with <code>React Testing Library</code>. The tests focus on user
        behavior, not implementation details.
      </p>

      <form onSubmit={handleSubmit} className="login-form">
        <h3>🔐 Login</h3>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={status === "loading"}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={status === "loading"}
          />
        </div>

        {status === "error" && (
          <div className="error-message" role="alert">
            ⚠️ {message}
          </div>
        )}

        <button
          type="submit"
          className="submit-btn"
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <>
              <span className="spinner"></span> Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <p className="hint">
          Hint: Use <code>test@example.com</code> / <code>password123</code>
        </p>
      </form>

      {/* Testing Tips */}
      <div className="testing-tips">
        <h4>🧪 Testing Approach</h4>
        <ul>
          <li>
            <strong>Arrange:</strong> Render the{" "}
            <code>&lt;LoginForm /&gt;</code>
          </li>
          <li>
            <strong>Act:</strong> Use <code>userEvent.type</code> and{" "}
            <code>userEvent.click</code>
          </li>
          <li>
            <strong>Assert:</strong> Use <code>screen.findByText</code> to
            verify success message
          </li>
          <li>
            <strong>Anti-Pattern:</strong> Don't test internal state, only what
            user sees!
          </li>
        </ul>
      </div>
    </div>
  );
}
