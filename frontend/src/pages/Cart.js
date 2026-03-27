import { useSelector, useDispatch } from 'react-redux';
import { useMemo, useState } from 'react';
import { checkoutCart } from '../services/rentalService';
import { clearCart, removeFromCart, updateRentalDays, updateRentalWindow } from '../features/cartSlice';

function Cart() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    const missingDates = cart.find((item) => !item.startDate || !item.endDate);
    if (missingDates) {
      setError(`Please select both start and end dates for ${missingDates.name}.`);
      return;
    }

    setPlacingOrder(true);
    setError('');
    setSuccess('');

    try {
      const payload = cart.map((item) => ({
        clothesId: item._id,
        rentalDays: Math.max(1, Number(item.rentalDays) || 1),
        startDate: item.startDate,
        endDate: item.endDate,
      }));

      const res = await checkoutCart(payload);
      dispatch(clearCart());
      setSuccess(`Order placed successfully. Order ID: ${res.data.orderId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="page-header">
        <h1 className="title-serif text-3xl">Your Cart</h1>
        <p className="text-gray-600 mt-1">Review rental dates, adjust duration, and place your order.</p>
      </div>

      {error && <p className="msg-error">{error}</p>}
      {success && <p className="msg-success">{success}</p>}

      {cart.length === 0 && (
        <div className="surface p-6 text-gray-600">Your cart is empty.</div>
      )}

      {cart.map((item) => (
        <div key={item._id} className="cart-row">
          <div className="cart-info">
            <p className="font-semibold text-gray-900">{item.name}</p>
            <p className="text-sm text-gray-600">Rs {item.pricePerDay}/day</p>
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

          <div className="cart-controls">
            <label className="text-sm">Days</label>
            <input
              type="number"
              min="1"
              value={item.rentalDays}
              onChange={(e) => dispatch(updateRentalDays({ id: item._id, rentalDays: e.target.value }))}
              className="qty-input"
            />

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
        <button onClick={handlePlaceOrder} disabled={placingOrder || cart.length === 0} className="btn-brand">
          {placingOrder ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
}

export default Cart;
