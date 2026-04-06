import { useSelector, useDispatch } from 'react-redux';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateRentalDays, updateRentalWindow } from '../features/cartSlice';
import { resolveMediaUrl, resolvePrimaryImage } from '../utils/media';

function Cart() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const total = useMemo(() => cart.reduce((sum, item) => {
    const days = Math.max(1, Number(item.rentalDays) || 1);
    return sum + item.pricePerDay * days;
  }, 0), [cart]);

  const handleDateChange = (item, field, value) => {
    const nextStart = field === "startDate" ? value : item.startDate?.slice(0, 10) || "";
    const nextEnd = field === "endDate" ? value : item.endDate?.slice(0, 10) || "";

    dispatch(updateRentalWindow({
      id: item._id,
      startDate: nextStart ? new Date(nextStart).toISOString() : "",
      endDate: nextEnd ? new Date(nextEnd).toISOString() : "",
    }));
  };

  const handleContinueToPayment = () => {
    if (cart.length === 0) return;

    const missingDates = cart.find((item) => !item.startDate || !item.endDate);
    if (missingDates) {
      setError(`Please select both start and end dates for ${missingDates.name}.`);
      return;
    }

    setError('');
    navigate('/payment');
  };

  return (
    <div className="space-y-4">
      <div className="page-header">
        <h1 className="title-serif text-3xl">Your Cart</h1>
        <p className="text-gray-600 mt-1">Review rental dates, adjust duration, and place your order.</p>
      </div>

      {error && <p className="msg-error">{error}</p>}

      {cart.length === 0 && (
        <div className="surface p-6 text-gray-600">Your cart is empty.</div>
      )}

      {cart.map((item) => (
        <div key={item._id} className="cart-card">
          <Link to={`/cloth/${item._id}`} className="cart-card-media">
            <img
              src={resolveMediaUrl(resolvePrimaryImage(item))}
              alt={item.name}
              loading="lazy"
            />
          </Link>

          <div className="cart-card-body">
            <div className="cart-card-copy">
              <p className="cart-card-kicker">{item.type || 'Rental item'}</p>
              <Link to={`/cloth/${item._id}`} className="cart-card-title">
                {item.name}
              </Link>
              <p className="cart-card-price">Rs {item.pricePerDay}/day</p>
              <p className="cart-card-subtle">
                {Math.max(1, Number(item.rentalDays) || 1)} day plan selected
              </p>
            </div>

            <div className="cart-date-grid">
              <div>
                <label className="field-label">Start</label>
                <input
                  type="date"
                  value={item.startDate ? item.startDate.slice(0, 10) : ""}
                  onChange={(e) => handleDateChange(item, "startDate", e.target.value)}
                  className="field-input"
                />
              </div>
              <div>
                <label className="field-label">End</label>
                <input
                  type="date"
                  value={item.endDate ? item.endDate.slice(0, 10) : ""}
                  onChange={(e) => handleDateChange(item, "endDate", e.target.value)}
                  className="field-input"
                />
              </div>
            </div>
          </div>

          <div className="cart-card-side">
            <div className="cart-card-stat">
              <label className="text-sm font-semibold text-gray-700">Days</label>
              <input
                type="number"
                min="1"
                value={item.rentalDays}
                onChange={(e) => dispatch(updateRentalDays({ id: item._id, rentalDays: e.target.value }))}
                className="qty-input"
              />
            </div>

            <div className="cart-card-stat">
              <span className="text-sm text-gray-500">Subtotal</span>
              <strong className="text-gray-900">
                Rs {item.pricePerDay * Math.max(1, Number(item.rentalDays) || 1)}
              </strong>
            </div>

            <button
              onClick={() => dispatch(removeFromCart(item._id))}
              className="btn-remove"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="cart-summary">
        <div>
          <p className="font-bold text-lg">Total: Rs {total}</p>
          <p className="text-sm text-gray-600">Delivery, pickup, and cleaning are included.</p>
        </div>
        <button onClick={handleContinueToPayment} disabled={cart.length === 0} className="btn-brand">
          Continue to Payment
        </button>
      </div>
    </div>
  );
}

export default Cart;
