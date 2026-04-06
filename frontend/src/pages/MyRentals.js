import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { clearHistory, getMyRentals, returnRental } from "../services/rentalService";
import { resolveMediaUrl, resolvePrimaryImage } from "../utils/media";

function MyRentals() {
  const [rentals, setRentals] = useState([]);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const getStatusClass = (status) => {
    if (status === "returned") return "status-returned";
    if (status === "late") return "status-late";
    return "status-active";
  };

  const loadRentals = async () => {
    try {
      const res = await getMyRentals();
      setRentals(res.data);
    } catch (err) {
      console.log(err);
      setFeedback({ type: "error", text: "Unable to load your rentals right now." });
    }
  };

  useEffect(() => {
    loadRentals();
  }, []);

  const summary = useMemo(() => ({
    active: rentals.filter((item) => item.status !== "returned").length,
    returned: rentals.filter((item) => item.status === "returned").length,
  }), [rentals]);

  const handleReturn = async (id) => {
    try {
      await returnRental(id);
      setFeedback({ type: "success", text: "Item returned successfully." });
      loadRentals();
    } catch (err) {
      setFeedback({ type: "error", text: err.response?.data?.message || "Return failed." });
    }
  };

  const handleClear = async () => {
    try {
      await clearHistory();
      setFeedback({ type: "success", text: "Returned history cleared." });
      loadRentals();
    } catch (err) {
      setFeedback({ type: "error", text: err.response?.data?.message || "Unable to clear history." });
    }
  };

  return (
    <div className="space-y-4">
      <div className="split-header">
        <div>
          <h2 className="title-serif text-3xl">My Rentals</h2>
          <p className="text-gray-600">Track active orders, return items, and manage your rental history.</p>
        </div>
        <button onClick={handleClear} className="btn-outline font-semibold">
          Clear History
        </button>
      </div>

      <div className="mixhome-proof">
        <article><strong>{rentals.length}</strong><span>Total Orders</span></article>
        <article><strong>{summary.active}</strong><span>Active Rentals</span></article>
        <article><strong>{summary.returned}</strong><span>Returned</span></article>
        <article><strong>24/7</strong><span>Support Window</span></article>
      </div>

      {feedback.text && (
        <p className={feedback.type === "error" ? "msg-error" : "msg-success"}>
          {feedback.text}
        </p>
      )}

      {rentals.length === 0 && (
        <div className="empty-state">No rentals yet.</div>
      )}

      {rentals.map((r) => (
        <div key={r._id} className="rental-card rental-product-card">
          <Link to={`/cloth/${r.clothesId?._id || ""}`} className="rental-card-media">
            <img
              src={resolveMediaUrl(resolvePrimaryImage(r.clothesId))}
              alt={r.clothesId?.name || "Rental item"}
              loading="lazy"
            />
          </Link>

          <div className="rental-card-body">
            <div className="rental-card-copy">
              <p className="cart-card-kicker">Order {r.orderId || "-"}</p>
              <Link to={`/cloth/${r.clothesId?._id || ""}`} className="cart-card-title">
                {r.clothesId?.name || "Rental item"}
              </Link>
              <p className="cart-card-price">Rs {r.totalPrice}</p>
              <p className="cart-card-subtle">
                {r.startDate ? new Date(r.startDate).toLocaleDateString() : "-"} to{" "}
                {r.endDate ? new Date(r.endDate).toLocaleDateString() : "-"}
              </p>
            </div>

            <div className="rental-meta rental-meta-grid">
              <p>Days: {r.rentalDays}</p>
              <p>Total: Rs {r.totalPrice}</p>
              <p>
                Status:
                <span className={getStatusClass(r.status)}>
                  {r.status}
                </span>
              </p>
            </div>
          </div>

          {r.status !== "returned" && (
            <div className="rental-actions rental-card-actions">
              <button onClick={() => handleReturn(r._id)} className="btn-brand">
                Return
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default MyRentals;
