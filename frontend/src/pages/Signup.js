import { useState } from "react";
import { signup } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    role: "user",
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    bio: "",
    companyName: "",
    businessType: "",
    gstNumber: "",
    officeAddress: "",
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

  const isAdmin = form.role === "admin";

return (
  <div className="auth-page">
    <div className="form-panel">
      <h2 className="title-serif text-3xl">Create Account</h2>
      <p className="text-gray-600 mt-1">Choose account type and create your RenAttire access.</p>

      {error && <p className="msg-error">{error}</p>}

      <form onSubmit={handleSubmit} className="form-stack">
        <div className="form-field">
          <label className="field-label">Account Type</label>
          <div className="adminx-segments">
            <button
              type="button"
              className={`adminx-segment ${form.role === "user" ? "active" : ""}`}
              onClick={() => setForm((prev) => ({ ...prev, role: "user" }))}
            >
              User Signup
            </button>
            <button
              type="button"
              className={`adminx-segment ${form.role === "admin" ? "active" : ""}`}
              onClick={() => setForm((prev) => ({ ...prev, role: "admin" }))}
            >
              Admin Signup
            </button>
          </div>
        </div>

        <div className="form-field">
          <label className="field-label">Name</label>
          <input className="field-input" name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
        </div>

        <div className="form-field">
          <label className="field-label">Email</label>
          <input className="field-input" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
        </div>

        <div className="form-field">
          <label className="field-label">Password</label>
          <input className="field-input" name="password" type="password" placeholder="Create password" value={form.password} onChange={handleChange} required />
        </div>

        <div className="adminx-form-row">
          <div className="form-field">
            <label className="field-label">Phone</label>
            <input className="field-input" name="phone" placeholder="+91 98..." value={form.phone} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label className="field-label">City</label>
            <input className="field-input" name="city" placeholder="Mumbai" value={form.city} onChange={handleChange} />
          </div>
        </div>

        <div className="form-field">
          <label className="field-label">{isAdmin ? "Admin Bio" : "Bio"}</label>
          <textarea className="field-input" name="bio" rows="3" placeholder={isAdmin ? "Tell us about your store or admin role." : "Tell us about your style preferences."} value={form.bio} onChange={handleChange} />
        </div>

        {isAdmin && (
          <>
            <div className="form-field">
              <label className="field-label">Company / Store Name</label>
              <input className="field-input" name="companyName" placeholder="RenAttire Studio" value={form.companyName} onChange={handleChange} required />
            </div>

            <div className="adminx-form-row">
              <div className="form-field">
                <label className="field-label">Business Type</label>
                <input className="field-input" name="businessType" placeholder="Rental Boutique" value={form.businessType} onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label className="field-label">GST Number</label>
                <input className="field-input" name="gstNumber" placeholder="22AAAAA0000A1Z5" value={form.gstNumber} onChange={handleChange} />
              </div>
            </div>

            <div className="form-field">
              <label className="field-label">Office Address</label>
              <textarea className="field-input" name="officeAddress" rows="3" placeholder="Enter office or store address" value={form.officeAddress} onChange={handleChange} required />
            </div>
          </>
        )}

        <button type="submit" disabled={loading} className="btn-brand w-full">
          {loading ? "Creating account..." : isAdmin ? "Create Admin Account" : "Create User Account"}
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
