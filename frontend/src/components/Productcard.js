import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import api from "../services/api";
import { addToCart } from '../features/cartSlice';
import { rentCloth } from "../services/rentalService";


function Productcard({ item, refreshClothes }) {
  const dispatch = useDispatch();

  const isAdmin = () => {
    try {
      const payload = JSON.parse(atob(localStorage.getItem("token").split(".")[1]));
      return payload.role === "admin";
    } catch {
      return false;
    }
  };

  const handleRent = async () => {
    try {
      await rentCloth(item._id, 2);
      alert("Rental successful!");
      refreshClothes();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this cloth?")) return;

    try {
      await api.delete(`/clothes/${item._id}`);
      alert("Deleted");
      refreshClothes();
    } catch {
      alert("Not allowed");
    }
  };

  const getStatusInfo = () => {
  if (item.status === "available")
    return { label: "Available", className: "status-badge status-available", canRent: true };

  if (item.status === "returning_soon")
    return { label: "Returning Soon", className: "status-badge status-returning", canRent: false };

  return { label: "Rented", className: "status-badge status-rented", canRent: false };
};

const statusInfo = getStatusInfo();

  return (
<div className="relative">
  <img
    src={`http://localhost:5000${item.image}`}
    alt={item.name}
    className="product-image"
  />
  <span className={statusInfo.className}>
    {statusInfo.label}
  </span>

      <h2 className="product-title">{item.name}</h2>
      <p className="product-price">₹{item.pricePerDay}/day</p>

      <div className="product-actions">
        <button onClick={() => dispatch(addToCart(item))} className="btn-brand">
          Add to Cart
        </button>

        <button
          onClick={handleRent}
          disabled={!statusInfo.canRent}
          className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {statusInfo.canRent ? "Rent Now" : statusInfo.label}
        </button>

        {isAdmin() && (
          <button onClick={handleDelete} className="btn-danger">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default Productcard;
