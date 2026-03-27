import { useEffect, useMemo, useState } from "react";
import { getProfile, updateProfile } from "../services/authService";

function Profile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfile();
        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          city: res.data.city || "",
          bio: res.data.bio || "",
        });
      } catch (err) {
        setFeedback({ type: "error", text: "Unable to load your account details." });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const profileStats = useMemo(() => ([
    { value: form.city || "Add city", label: "Primary location" },
    { value: form.phone || "Add phone", label: "Contact number" },
    { value: form.bio ? "Updated" : "Pending", label: "Profile completeness" },
  ]), [form.bio, form.city, form.phone]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: "", text: "" });

    try {
      const res = await updateProfile({
        name: form.name,
        phone: form.phone,
        city: form.city,
        bio: form.bio,
      });
      setForm((prev) => ({
        ...prev,
        ...res.data.user,
      }));
      setFeedback({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setFeedback({ type: "error", text: err.response?.data?.message || "Unable to update profile." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="surface p-6 text-gray-600">Loading profile...</div>;
  }

  return (
    <div className="space-y-5">
      <div className="page-header">
        <h1 className="title-serif text-3xl">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account details and keep booking information current.</p>
      </div>

      <div className="mixhome-proof">
        {profileStats.map((item) => (
          <article key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </div>

      {feedback.text && (
        <p className={feedback.type === "error" ? "msg-error" : "msg-success"}>
          {feedback.text}
        </p>
      )}

      <form onSubmit={handleSubmit} className="adminx-panel surface adminx-form">
        <div className="adminx-form-row">
          <div className="form-field">
            <label className="field-label">Full Name</label>
            <input className="field-input" name="name" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label className="field-label">Email</label>
            <input className="field-input" name="email" value={form.email} disabled />
          </div>
        </div>

        <div className="adminx-form-row">
          <div className="form-field">
            <label className="field-label">Phone</label>
            <input className="field-input" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98..." />
          </div>
          <div className="form-field">
            <label className="field-label">City</label>
            <input className="field-input" name="city" value={form.city} onChange={handleChange} placeholder="Pune" />
          </div>
        </div>

        <div className="form-field">
          <label className="field-label">Bio</label>
          <textarea className="field-input" rows={5} name="bio" value={form.bio} onChange={handleChange} placeholder="Tell us about your style, preferred fits, or event needs." />
        </div>

        <button disabled={saving} className="btn-brand w-fit">
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}

export default Profile;
