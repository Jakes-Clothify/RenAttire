import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cartSlice";
import { toggleWishlistLocal } from "../features/wishlistSlice";
import { toggleWishlist } from "../services/authService";
import { resolveMediaUrl, resolvePrimaryImage } from "../utils/media";
import { isLoggedIn } from "../utils/auth";

function Productcard({ item, refreshClothes }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector((state) => state.wishlist);
  const isSaved = wishlist.some((wishlistItem) => wishlistItem._id === item._id);

  const handleRent = async () => {
    navigate(`/cloth/${item._id}`);
    refreshClothes();
  };

  const handleAddToCart = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() + 1);

    const end = new Date(start);
    end.setDate(end.getDate() + 2);

    dispatch(addToCart({
      ...item,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      rentalDays: 2,
    }));
  };

  const handleToggleWishlist = async () => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    dispatch(toggleWishlistLocal(item));
    try {
      await toggleWishlist(item._id);
    } catch (err) {
      dispatch(toggleWishlistLocal(item));
    }
  };

  const getStatusInfo = () => {
    if (item.status === "available") {
      return {
        label: "Available",
        className: "status-available",
        canRent: true
      };
    }

    if (item.status === "returning_soon") {
      return {
        label: "Returning Soon",
        className: "status-returning",
        canRent: false
      };
    }

    return {
      label: "Rented",
      className: "status-rented",
      canRent: false
    };
  };

  const statusInfo = getStatusInfo();
  const imageUrl = resolveMediaUrl(resolvePrimaryImage(item));

  return (
    <div className="product-card">
      <Link to={`/cloth/${item._id}`} className="product-media">
        <div className="product-image-wrapper">
          <img
            src={imageUrl}
            alt={item.name}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = resolveMediaUrl("");
            }}
          />
        </div>

        <span className={`product-badge ${statusInfo.className}`}>
          {statusInfo.label}
        </span>
      </Link>

      <div className="product-info">
        <h2 className="product-title">{item.name}</h2>

        <p className="product-desc">
          {item.description?.trim() || "Premium rental outfit perfect for special occasions."}
        </p>

        <p className="product-price">Rs {item.pricePerDay}/day</p>

        <button onClick={handleToggleWishlist} className="secondary-action">
          {isSaved ? "Remove from Wishlist" : "Save to Wishlist"}
        </button>

        <button onClick={handleAddToCart} className="primary-action">
          Add to Cart
        </button>

        <button
          onClick={handleRent}
          disabled={!statusInfo.canRent}
          className="secondary-action"
        >
          {statusInfo.canRent ? "Rent Now" : statusInfo.label}
        </button>
      </div>
    </div>
  );
}

export default Productcard;
