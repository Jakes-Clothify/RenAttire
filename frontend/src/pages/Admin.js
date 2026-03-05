import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { fitProfiles } from "../config/fitProfiles";

function Admin() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    detailedDescription: "",
    brand: "",
    color: "",
    fabric: "",
    occasion: "",
    careInstructions: "",
    highlights: "",
    pricePerDay: "",
  });
  const [image, setImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [type, setType] = useState("");
  const [fitProfile, setFitProfile] = useState("");
  const [currentSize, setCurrentSize] = useState({});
  const [rentals, setRentals] = useState([]);
  const [rentalFilter, setRentalFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [myProducts, setMyProducts] = useState([]);

  const imagePreview = useMemo(() => {
    if (!image) return "";
    return URL.createObjectURL(image);
  }, [image]);
  const galleryPreviews = useMemo(
    () => galleryImages.map((file) => URL.createObjectURL(file)),
    [galleryImages]
  );

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      galleryPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreview, galleryPreviews]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fetchRentals = async () => {
    try {
      const res = await api.get("/rentals/admin/all");
      setRentals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyProducts = async () => {
    try {
      const res = await api.get("/clothes/mine");
      const items = Array.isArray(res.data) ? res.data : res.data.items || [];
      setMyProducts(items);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRentals();
    fetchMyProducts();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const formattedSizes = Object.keys(currentSize).length
      ? [
          {
            measurements: Object.fromEntries(
              Object.entries(currentSize)
                .filter(([, v]) => v !== "" && v !== null)
                .map(([k, v]) => [k, Number(v)])
            ),
          },
        ]
      : [];

    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("description", form.description.trim());
    formData.append("detailedDescription", form.detailedDescription.trim());
    formData.append("brand", form.brand.trim());
    formData.append("color", form.color.trim());
    formData.append("fabric", form.fabric.trim());
    formData.append("occasion", form.occasion.trim());
    formData.append("careInstructions", form.careInstructions.trim());
    formData.append("highlights", form.highlights.trim());
    formData.append("pricePerDay", form.pricePerDay);
    formData.append("image", image);
    galleryImages.forEach((file) => formData.append("images", file));
    formData.append("type", type.trim());
    formData.append("fitProfile", fitProfile);
    formData.append("availableSizes", JSON.stringify(formattedSizes));

    try {
      await api.post("/clothes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Product added successfully.");
      setForm({
        name: "",
        description: "",
        detailedDescription: "",
        brand: "",
        color: "",
        fabric: "",
        occasion: "",
        careInstructions: "",
        highlights: "",
        pricePerDay: "",
      });
      setImage(null);
      setGalleryImages([]);
      setCurrentSize({});
      setType("");
      setFitProfile("");
      fetchRentals();
      fetchMyProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const activeRentals = rentals.filter((r) => r.status !== "returned").length;
  const returnedRentals = rentals.filter((r) => r.status === "returned").length;
  const totalRevenue = rentals.reduce((sum, r) => sum + (Number(r.totalPrice) || 0), 0);

  const visibleRentals = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return rentals
      .filter((r) => (rentalFilter === "all" ? true : r.status === rentalFilter))
      .filter((r) => {
        if (!q) return true;
        const product = r.clothesId?.name?.toLowerCase() || "";
        const user = r.userId?.name?.toLowerCase() || "";
        const email = r.userId?.email?.toLowerCase() || "";
        const order = (r.orderId || "").toLowerCase();
        return product.includes(q) || user.includes(q) || email.includes(q) || order.includes(q);
      })
      .sort((a, b) => new Date(b.createdAt || b.startDate) - new Date(a.createdAt || a.startDate));
  }, [rentals, rentalFilter, searchText]);

  return (
    <div className="adminx-page">
      <div className="adminx-grid">
        <section className="adminx-panel surface">
          <div className="adminx-head">
            <h2 className="title-serif text-3xl">Catalog Manager</h2>
            <p>Create product listings with full, blog-style detail.</p>
          </div>

          {message && <p className="msg-success">{message}</p>}
          {error && <p className="msg-error">{error}</p>}

          <form onSubmit={handleAdd} className="adminx-form">
            <div className="form-field">
              <label className="field-label">Product Name</label>
              <input
                className="field-input"
                name="name"
                placeholder="Premium Sherwani"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="adminx-form-row">
              <div className="form-field">
                <label className="field-label">Category Type</label>
                <input
                  className="field-input"
                  type="text"
                  placeholder="Sherwani, Kurta, Jeans"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label className="field-label">Price per Day</label>
                <input
                  className="field-input"
                  name="pricePerDay"
                  type="number"
                  min="1"
                  placeholder="1499"
                  value={form.pricePerDay}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="adminx-form-row">
              <div className="form-field">
                <label className="field-label">Brand</label>
                <input
                  className="field-input"
                  name="brand"
                  placeholder="Raymond"
                  value={form.brand}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label className="field-label">Color</label>
                <input
                  className="field-input"
                  name="color"
                  placeholder="Navy Blue"
                  value={form.color}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="adminx-form-row">
              <div className="form-field">
                <label className="field-label">Fabric</label>
                <input
                  className="field-input"
                  name="fabric"
                  placeholder="Silk Blend"
                  value={form.fabric}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label className="field-label">Best Occasion</label>
                <input
                  className="field-input"
                  name="occasion"
                  placeholder="Wedding, Reception"
                  value={form.occasion}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="field-label">Short Description</label>
              <textarea
                className="field-input"
                name="description"
                rows="3"
                placeholder="Quick summary about this outfit..."
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label className="field-label">Detailed Description (Blog Style)</label>
              <textarea
                className="field-input"
                name="detailedDescription"
                rows="7"
                placeholder="Write full long-form product story, styling notes, fit advice, etc."
                value={form.detailedDescription}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label className="field-label">Highlights (one per line)</label>
              <textarea
                className="field-input"
                name="highlights"
                rows="4"
                placeholder={"Premium finish\nOccasion ready\nComfort fit"}
                value={form.highlights}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label className="field-label">Care Instructions</label>
              <textarea
                className="field-input"
                name="careInstructions"
                rows="3"
                placeholder="Dry clean only. Steam before use..."
                value={form.careInstructions}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label className="field-label">Fit Profile</label>
              <select
                className="field-input"
                value={fitProfile}
                onChange={(e) => {
                  setFitProfile(e.target.value);
                  setCurrentSize({});
                }}
                required
              >
                <option value="">Select Fit Profile</option>
                <option value="upper">Upper Body</option>
                <option value="lower">Lower Body</option>
                <option value="full">Full Body</option>
                <option value="footwear">Footwear</option>
                <option value="free">Free Size</option>
              </select>
            </div>

            {fitProfile && fitProfiles[fitProfile]?.length > 0 && (
              <div className="form-field">
                <label className="field-label">Measurements (cm)</label>
                <div className="adminx-size-grid">
                  {fitProfiles[fitProfile].map((field) => (
                    <input
                      key={field}
                      className="field-input"
                      type="number"
                      min="1"
                      placeholder={field}
                      value={currentSize[field] || ""}
                      onChange={(e) =>
                        setCurrentSize((prev) => ({
                          ...prev,
                          [field]: e.target.value,
                        }))
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="form-field">
              <label className="field-label">Primary Product Image</label>
              <input
                className="field-input"
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                required
              />
            </div>

            <div className="form-field">
              <label className="field-label">Additional Gallery Images</label>
              <input
                className="field-input"
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={(e) => setGalleryImages(Array.from(e.target.files || []))}
              />
            </div>

            {imagePreview && (
              <div className="adminx-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
            {galleryPreviews.length > 0 && (
              <div className="adminx-gallery-preview">
                {galleryPreviews.map((src, idx) => (
                  <img key={src} src={src} alt={`Gallery ${idx + 1}`} />
                ))}
              </div>
            )}

            <button disabled={loading} className="btn-brand">
              {loading ? "Adding Product..." : "Add Product"}
            </button>
          </form>

          <div className="adminx-my-products">
            <h3 className="title-serif text-xl">My Products</h3>
            {myProducts.length === 0 && <p className="muted">No products added by you yet.</p>}
            <div className="adminx-my-products-list">
              {myProducts.map((item) => (
                <article key={item._id} className="adminx-my-product-card">
                  <div>
                    <h4>{item.name}</h4>
                    <p>Rs {item.pricePerDay}/day</p>
                  </div>
                  <Link className="btn-outline" to={`/admin/cloth/${item._id}/edit`}>
                    Edit
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="adminx-panel surface">
          <div className="adminx-head">
            <h2 className="title-serif text-2xl">Rental Operations</h2>
            <p>Track order activity and fulfillment state.</p>
          </div>

          <div className="adminx-stats">
            <div className="adminx-stat">
              <span>Total Rentals</span>
              <strong>{rentals.length}</strong>
            </div>
            <div className="adminx-stat">
              <span>Active</span>
              <strong>{activeRentals}</strong>
            </div>
            <div className="adminx-stat">
              <span>Returned</span>
              <strong>{returnedRentals}</strong>
            </div>
            <div className="adminx-stat">
              <span>Revenue</span>
              <strong>Rs {totalRevenue}</strong>
            </div>
          </div>

          <div className="adminx-toolbar">
            <div className="adminx-segments">
              <button
                type="button"
                className={`adminx-segment ${rentalFilter === "all" ? "active" : ""}`}
                onClick={() => setRentalFilter("all")}
              >
                All
              </button>
              <button
                type="button"
                className={`adminx-segment ${rentalFilter === "active" ? "active" : ""}`}
                onClick={() => setRentalFilter("active")}
              >
                Active
              </button>
              <button
                type="button"
                className={`adminx-segment ${rentalFilter === "returned" ? "active" : ""}`}
                onClick={() => setRentalFilter("returned")}
              >
                Returned
              </button>
            </div>

            <input
              className="field-input"
              placeholder="Search product, user, email, order ID"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="adminx-rental-list">
            {visibleRentals.length === 0 && (
              <p className="muted">No rentals match your current filter.</p>
            )}

            {visibleRentals.map((r) => (
              <article key={r._id} className="adminx-rental-card">
                <div className="adminx-rental-head">
                  <h4>{r.clothesId?.name || "Unknown Product"}</h4>
                  <span className={`adminx-status adminx-${r.status}`}>{r.status}</span>
                </div>

                <div className="adminx-rental-meta">
                  <p><span>User:</span> {r.userId?.name || "N/A"}</p>
                  <p><span>Email:</span> {r.userId?.email || "N/A"}</p>
                  <p><span>Order ID:</span> {r.orderId || "-"}</p>
                  <p><span>Start:</span> {new Date(r.startDate).toLocaleDateString()}</p>
                  <p><span>End:</span> {new Date(r.endDate).toLocaleDateString()}</p>
                  <p><span>Total:</span> Rs {r.totalPrice || 0}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Admin;
