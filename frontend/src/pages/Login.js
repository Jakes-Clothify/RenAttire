import { useState } from "react";
import { login } from "../services/authService";
import { Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    role: "user",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await login(form);
      localStorage.setItem("token", res.data.token);
      window.location.href = "/";
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="auth-page">
    <div className="form-panel">
      <h2 className="title-serif text-3xl">Welcome Back</h2>
      <p className="text-gray-600 mt-1">Choose your account type and sign in.</p>

      {error && <p className="msg-error">{error}</p>}

      <form onSubmit={handleSubmit} className="form-stack">
        <div className="form-field">
          <label className="field-label">Login Type</label>
          <div className="adminx-segments">
            <button
              type="button"
              className={`adminx-segment ${form.role === "user" ? "active" : ""}`}
              onClick={() => setForm((prev) => ({ ...prev, role: "user" }))}
            >
              User Login
            </button>
            <button
              type="button"
              className={`adminx-segment ${form.role === "admin" ? "active" : ""}`}
              onClick={() => setForm((prev) => ({ ...prev, role: "admin" }))}
            >
              Admin Login
            </button>
          </div>
        </div>

        <div className="form-field">
          <label className="field-label">Email</label>
          <input className="field-input" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
        </div>

        <div className="form-field">
          <label className="field-label">Password</label>
          <input className="field-input" name="password" type="password" placeholder="Enter password" value={form.password} onChange={handleChange} required />
        </div>

        {form.role === "admin" && (
          <div className="form-field">
            <label className="field-label">Admin Access</label>
            <input className="field-input" value="Admin account sign-in enabled" disabled />
          </div>
        )}

        <div className="form-field">
          <label className="field-label">Signin Note</label>
          <input
            className="field-input"
            value={form.role === "admin" ? "Use the email/password registered for your admin account." : "Use your regular customer account details."}
            disabled
          />
        </div>

        <button type="submit" disabled={loading} className="btn-brand w-full">
          {loading ? "Signing in..." : form.role === "admin" ? "Login as Admin" : "Login as User"}
        </button>

      </form>

      <p className="auth-footer">
        New to RenAttire? <Link to="/signup" className="auth-link">Create account</Link>
      </p>
    </div>
  </div>
);
   
}

export default Login;
