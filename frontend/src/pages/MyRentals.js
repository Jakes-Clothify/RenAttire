import { useEffect, useMemo, useState } from "react";
import { clearHistory, getMyRentals, returnRental } from "../services/rentalService";

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
        <div key={r._id} className="rental-card">
          <h3 className="text-xl font-semibold text-gray-900">
            {r.clothesId?.name}
          </h3>

          <div className="rental-meta">
            <p>Order ID: {r.orderId || "-"}</p>
            <p>Days: {r.rentalDays}</p>
            <p>Total: Rs {r.totalPrice}</p>
            <p>Start: {r.startDate ? new Date(r.startDate).toLocaleDateString() : "-"}</p>
            <p>End: {r.endDate ? new Date(r.endDate).toLocaleDateString() : "-"}</p>
            <p>
              Status:
              <span className={getStatusClass(r.status)}>
                {r.status}
              </span>
            </p>
          </div>

          {r.status !== "returned" && (
            <div className="rental-actions">
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
