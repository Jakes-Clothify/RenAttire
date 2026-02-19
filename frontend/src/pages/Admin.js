import { useState } from "react";
import api from "../services/api";

function Admin() {
  const [form, setForm] = useState({
    name: "",
    pricePerDay: "",
    image: ""
  });

  const [image, setImage] = useState(null);
  const [sizes] = useState([
    { chest: "", waist: "", shoulder: "", hips: "", length: "" }
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const formattedSizes = sizes.map(s => ({
      measurements: Object.fromEntries(
        Object.entries(s)
          .filter(([_, v]) => v !== "")
          .map(([k, v]) => [k, Number(v)])
      )
    }));

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("pricePerDay", form.pricePerDay);
    formData.append("image", image);
    formData.append("sizes", JSON.stringify(formattedSizes));

    try {
      await api.post("/clothes", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setMessage("Cloth added successfully.");
      setForm({ name: "", pricePerDay: "", image: "" });
      setImage(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add cloth");
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="form-page">
    <div className="form-panel">
      <h2 className="title-serif text-3xl">Admin Panel</h2>
      <p className="text-gray-600 mt-1">Add new clothes to your catalog.</p>

      {message && <p className="msg-success">{message}</p>}
      {error && <p className="msg-error">{error}</p>}

      <form onSubmit={handleAdd} className="form-stack">

        <div className="form-field">
          <label className="field-label">Cloth Name</label>
          <input
            className="field-input"
            name="name"
            placeholder="Premium Sherwani"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label className="field-label">Price / Day</label>
          <input
            className="field-input"
            name="pricePerDay"
            type="number"
            placeholder="1499"
            value={form.pricePerDay}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label className="field-label">Image</label>
          <input
            className="field-input"
            type="file"
            name="image"
            onChange={e => setImage(e.target.files[0])}
          />
        </div>

        <button disabled={loading} className="btn-brand">
          {loading ? "Adding..." : "Add Cloth"}
        </button>

      </form>
    </div>
  </div>
);

}

export default Admin;
