import { useState } from "react";
import { signup } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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
      await signup(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="auth-page">
    <div className="form-panel">
      <h2 className="title-serif text-3xl">Create Account</h2>
      <p className="text-gray-600 mt-1">Start your rental journey with Clothify.</p>

      {error && <p className="msg-error">{error}</p>}

      <form onSubmit={handleSubmit} className="form-stack">

        <div className="form-field">
          <label className="field-label">Name</label>
          <input className="field-input" name="name" placeholder="Your name" onChange={handleChange}/>
        </div>

        <div className="form-field">
          <label className="field-label">Email</label>
          <input className="field-input" name="email" placeholder="you@example.com" onChange={handleChange}/>
        </div>

        <div className="form-field">
          <label className="field-label">Password</label>
          <input className="field-input" name="password" type="password" placeholder="Create password" onChange={handleChange}/>
        </div>

        <button type="submit" disabled={loading} className="btn-brand w-full">
          {loading ? "Creating account..." : "Signup"}
        </button>

      </form>

      <p className="auth-footer">
        Already have an account? <Link to="/login" className="auth-link">Login</Link>
      </p>
    </div>
  </div>
);

}

export default Signup;
