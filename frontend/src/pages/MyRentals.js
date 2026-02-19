import { useEffect, useState } from "react";
import { getMyRentals, returnRental } from "../services/rentalService";
import { clearHistory } from "../services/rentalService";


function MyRentals() {
  const [rentals, setRentals] = useState([]);

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
    }
  };

  useEffect(() => {
    loadRentals();
  }, []);

  const handleReturn = async (id) => {
    try {
      await returnRental(id);
      alert("Item returned");
      loadRentals();   // refresh list
    } catch (err) {
      alert("Return failed");
    }
  };

  const handleClear = async () => {
  await clearHistory();
  loadRentals();
};
    
return (
  <div className="space-y-4">

    <div className="split-header">
      <div>
        <h2 className="title-serif text-3xl">My Rentals</h2>
        <p className="text-gray-600">Track active and returned items.</p>
      </div>
      <button onClick={handleClear} className="btn-outline font-semibold">
        Clear History
      </button>
    </div>

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
          <p>Total: ${r.totalPrice}</p>
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
            <button onClick={()=>handleReturn(r._id)} className="btn-brand">
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
