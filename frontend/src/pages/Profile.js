import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../services/authService";
import { getMyRentals } from "../services/rentalService";
import { logout } from "../utils/auth";
import { resolveMediaUrl, resolvePrimaryImage } from "../utils/media";

function Profile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    bio: "",
    role: "user",
    companyName: "",
    businessType: "",
    gstNumber: "",
    officeAddress: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const navigate = useNavigate();

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
          role: res.data.role || "user",
          companyName: res.data.companyName || "",
          businessType: res.data.businessType || "",
          gstNumber: res.data.gstNumber || "",
          officeAddress: res.data.officeAddress || "",
        });
      } catch (err) {
        setFeedback({ type: "error", text: "Unable to load your account details." });
      } finally {
        setLoading(false);
      }
    };

    const loadOrders = async () => {
      try {
        const res = await getMyRentals();
        setOrders(res.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setOrdersLoading(false);
      }
    };

    loadProfile();
    loadOrders();
  }, []);

  const profileStats = useMemo(() => ([
    { value: form.city || "Add city", label: "Primary location" },
    { value: form.phone || "Add phone", label: "Contact number" },
    { value: form.address || "Add address", label: "Address" },
    { value: form.role === "admin" ? (form.companyName || "Add business") : (form.bio ? "Updated" : "Pending"), label: form.role === "admin" ? "Business profile" : "Profile completeness" },
  ]), [form.bio, form.city, form.companyName, form.phone, form.role]);

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
        companyName: form.companyName,
        businessType: form.businessType,
        gstNumber: form.gstNumber,
        officeAddress: form.officeAddress,
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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return <div className="surface p-6 text-gray-600">Loading profile...</div>;
  }

  const isAdmin = form.role === "admin";

  return (
    <div className="space-y-5">
      <div className="page-header">
        <h1 className="title-serif text-3xl">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account details and keep booking information current.</p>
        <p className="text-sm text-slate-500 mt-2">Account type: {isAdmin ? "Admin" : "User"}</p>
      </div>

      <div className="mixhome-proof">
        {profileStats.map((item) => (
          <article key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Link to="/my-rentals" className="surface rounded-[1.8rem] border border-black/10 p-5 transition hover:shadow-lg">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">My Orders</p>
          <h2 className="mt-4 text-4xl font-semibold">{ordersLoading ? "..." : orders.length}</h2>
          <p className="mt-3 text-sm text-gray-600">Quick access to your order history and product details.</p>
        </Link>

        <div className="surface rounded-[1.8rem] border border-black/10 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Order actions</p>
          <p className="mt-3 text-sm text-gray-600">Tap below to see your ordered products in a short card view and open details for any item.</p>
          <Link to="/my-rentals" className="btn-brand mt-5 inline-flex items-center justify-center w-full px-4 py-3">
            View My Orders
          </Link>
        </div>
      </div>

      {orders.length > 0 && (
        <div className="space-y-4">
          <div className="split-header">
            <div>
              <h2 className="title-serif text-2xl">Recent Orders</h2>
              <p className="text-gray-600">Open any ordered product to view its detail page.</p>
            </div>
            <Link to="/my-rentals" className="text-sm text-teal-700 hover:underline">See all orders</Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {orders.slice(0, 2).map((order) => (
              <Link
                key={order._id}
                to={`/cloth/${order.clothesId?._id || ""}`}
                className="rental-product-card rounded-[1.6rem] p-4 border border-black/10 bg-white transition hover:shadow-lg"
              >
                <div className="rental-card-media">
                  <img
                    src={resolveMediaUrl(resolvePrimaryImage(order.clothesId))}
                    alt={order.clothesId?.name || "Ordered item"}
                    loading="lazy"
                  />
                </div>
                      
                <div className="rental-card-body">
                  <p className="cart-card-kicker">Order {order.orderId || "-"}</p>
                  <p className="cart-card-title">{order.clothesId?.name || "Ordered item"}</p>
                  <p className="cart-card-price">Rs {order.totalPrice}</p>
                  <p className="cart-card-subtle">
                    {order.startDate ? new Date(order.startDate).toLocaleDateString() : "-"} to {order.endDate ? new Date(order.endDate).toLocaleDateString() : "-"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

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
          <label className="field-label">{isAdmin ? "Admin Bio" : "Bio"}</label>
          <textarea className="field-input" rows={5} name="bio" value={form.bio} onChange={handleChange} placeholder={isAdmin ? "Tell us about your business, inventory focus, or service area." : "Tell us about your style, preferred fits, or event needs."} />
        </div>

        {isAdmin && (
          <>
            <div className="adminx-form-row">
              <div className="form-field">
                <label className="field-label">Company / Store Name</label>
                <input className="field-input" name="companyName" value={form.companyName} onChange={handleChange} placeholder="RenAttire Studio" />
              </div>
              <div className="form-field">
                <label className="field-label">Business Type</label>
                <input className="field-input" name="businessType" value={form.businessType} onChange={handleChange} placeholder="Rental Boutique" />
              </div>
            </div>

            <div className="adminx-form-row">
              <div className="form-field">
                <label className="field-label">GST Number</label>
                <input className="field-input" name="gstNumber" value={form.gstNumber} onChange={handleChange} placeholder="22AAAAA0000A1Z5" />
              </div>
              <div className="form-field">
                <label className="field-label">Office Address</label>
                <input className="field-input" name="officeAddress" value={form.officeAddress} onChange={handleChange} placeholder="Store or office address" />
              </div>
            </div>
          </>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button disabled={saving} className="btn-brand w-fit">
            {saving ? "Saving..." : "Save Profile"}
          </button>

          <button type="button" onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
