import { useState } from "react";
import { login } from "../services/authService";
import { Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
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
      <p className="text-gray-600 mt-1">Login to continue renting.</p>

      {error && <p className="msg-error">{error}</p>}

      <form onSubmit={handleSubmit} className="form-stack">

        <div className="form-field">
          <label className="field-label">Email</label>
          <input className="field-input" name="email" placeholder="you@example.com" onChange={handleChange}/>
        </div>

        <div className="form-field">
          <label className="field-label">Password</label>
          <input className="field-input" name="password" type="password" placeholder="Enter password" onChange={handleChange}/>
        </div>

        <button type="submit" disabled={loading} className="btn-brand w-full">
          {loading ? "Signing in..." : "Login"}
        </button>

      </form>

      <p className="auth-footer">
        New to Clothify? <Link to="/signup" className="auth-link">Create account</Link>
      </p>
    </div>
  </div>
);
   
}

export default Login;
