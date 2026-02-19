import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { checkoutCart } from '../services/rentalService';
import { clearCart, removeFromCart, updateRentalDays } from '../features/cartSlice';

function Cart() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const total = cart.reduce((sum, item) => {
    const days = Math.max(1, Number(item.rentalDays) || 1);
    return sum + item.pricePerDay * days;
  }, 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    setPlacingOrder(true);
    setError('');
    setSuccess('');

    try {
      const payload = cart.map((item) => ({
        clothesId: item._id,
        rentalDays: Math.max(1, Number(item.rentalDays) || 1),
      }));

      const res = await checkoutCart(payload);
      dispatch(clearCart());
      setSuccess(`Order placed. Order ID: ${res.data.orderId}`);
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
      <p className="text-gray-600 mt-1">Review days and place your order.</p>
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
          <p className="text-sm text-gray-600">${item.pricePerDay}/day</p>
        </div>

        <div className="cart-controls">
          <label className="text-sm">Days</label>
          <input
            type="number"
            min="1"
            value={item.rentalDays}
            onChange={(e)=>dispatch(updateRentalDays({ id:item._id, rentalDays:e.target.value }))}
            className="qty-input"
          />

          <button
            onClick={()=>dispatch(removeFromCart(item._id))}
            className="btn-remove"
          >
            Remove
          </button>
        </div>

      </div>
    ))}

    <div className="cart-summary">
      <p className="font-bold text-lg">Total: ${total}</p>
      <button onClick={handlePlaceOrder} disabled={placingOrder||cart.length===0} className="btn-brand">
        {placingOrder ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>

  </div>
);

}
export default Cart;
