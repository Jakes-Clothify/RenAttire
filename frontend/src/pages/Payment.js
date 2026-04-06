import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { checkoutCart } from "../services/rentalService";
import { clearCart } from "../features/cartSlice";
import { resolveMediaUrl, resolvePrimaryImage } from "../utils/media";

function Payment() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const total = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const days = Math.max(1, Number(item.rentalDays) || 1);
        return sum + item.pricePerDay * days;
      }, 0),
    [cart]
  );

  if (cart.length === 0 && !success) {
    return <Navigate to="/cart" replace />;
  }

  const handlePlaceOrder = async () => {
    const missingDates = cart.find((item) => !item.startDate || !item.endDate);
    if (missingDates) {
      setError(`Please complete the rental dates for ${missingDates.name} before payment.`);
      return;
    }

    if (paymentMethod !== "cod") {
      setError("Cash on Delivery is the only payment method available right now.");
      return;
    }

    setPlacingOrder(true);
    setError("");
    setSuccess("");

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
      setError(err.response?.data?.message || "Unable to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-main surface">
        <section className="checkout-hero">
          <div className="checkout-crumbs">
            <Link to="/cart">Cart</Link>
            <span>/</span>
            <strong>Payment</strong>
          </div>

          <div className="checkout-hero-top">
            <div>
              <p className="checkout-step">Step 2 of 2</p>
              <h1 className="title-serif text-3xl">Secure checkout</h1>
              <p className="text-gray-600 mt-2">
                Review your rental order and confirm with Cash on Delivery.
              </p>
            </div>

            <div className="checkout-secure-badge">
              <strong>Protected order flow</strong>
              <span>{cart.length} item{cart.length > 1 ? "s" : ""}</span>
            </div>
          </div>
        </section>

        {error && <p className="msg-error">{error}</p>}
        {success && <p className="msg-success">{success}</p>}

        {!success && (
          <>
            <section className="checkout-block surface">
              <div className="checkout-block-head">
                <div>
                  <p className="checkout-kicker">Payment method</p>
                  <h2 className="text-xl font-semibold">Choose how you want to pay</h2>
                  <p className="checkout-subcopy">Only one method is enabled right now for rentals.</p>
                </div>
                <span className="checkout-pill">1 option available</span>
              </div>

              <label className="payment-option payment-option-active">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div>
                  <strong>Cash on Delivery</strong>
                  <p>Pay in cash when your rental is delivered to you.</p>
                  <div className="payment-option-meta">
                    <span>No online payment</span>
                    <span>Delivery handoff</span>
                    <span>Easy confirmation</span>
                  </div>
                </div>
              </label>
            </section>

            <section className="checkout-block surface">
              <div className="checkout-block-head">
                <div>
                  <p className="checkout-kicker">Before you order</p>
                  <h2 className="text-xl font-semibold">Delivery notes</h2>
                  <p className="checkout-subcopy">A few quick reminders before you place the rental.</p>
                </div>
              </div>

              <div className="checkout-note-grid">
                <article>
                  <strong>Delivery included</strong>
                  <p>Your rental total already includes delivery, pickup, and cleaning.</p>
                </article>
                <article>
                  <strong>Keep cash ready</strong>
                  <p>Please keep the exact amount ready for a smoother handoff.</p>
                </article>
                <article>
                  <strong>Review dates</strong>
                  <p>We will process the order using the rental dates selected in your cart.</p>
                </article>
              </div>
            </section>
          </>
        )}

        <div className="checkout-actions">
          <Link to="/cart" className="btn-outline">
            Back to Cart
          </Link>
          {!success ? (
            <button onClick={handlePlaceOrder} disabled={placingOrder} className="btn-brand">
              {placingOrder ? "Placing Order..." : "Confirm Cash on Delivery"}
            </button>
          ) : (
            <Link to="/shop" className="btn-brand">
              Continue Shopping
            </Link>
          )}
        </div>
      </div>

      <aside className="checkout-sidebar surface">
        <div className="checkout-summary-head">
          <div>
            <p className="checkout-kicker">Order summary</p>
            <h2 className="text-xl font-semibold">Your rental items</h2>
          </div>
          <Link to="/cart" className="checkout-edit-link">
            Edit cart
          </Link>
        </div>

        <div className="checkout-summary-list">
          {cart.map((item) => {
            const days = Math.max(1, Number(item.rentalDays) || 1);
            const itemTotal = item.pricePerDay * days;

            return (
              <div key={item._id} className="checkout-summary-card">
                <Link to={`/cloth/${item._id}`} className="checkout-summary-media">
                  <img
                    src={resolveMediaUrl(resolvePrimaryImage(item))}
                    alt={item.name}
                    loading="lazy"
                  />
                </Link>

                <div className="checkout-summary-copy">
                  <p className="cart-card-kicker">{item.type || "Rental item"}</p>
                  <Link to={`/cloth/${item._id}`} className="checkout-summary-title">
                    {item.name}
                  </Link>
                  <p className="checkout-summary-meta">
                    {days} day{days > 1 ? "s" : ""} | Rs {item.pricePerDay}/day
                  </p>
                  <p className="checkout-summary-dates">
                    {item.startDate?.slice(0, 10)} to {item.endDate?.slice(0, 10)}
                  </p>
                </div>

                <div className="checkout-summary-price">
                  <span>Subtotal</span>
                  <strong>Rs {itemTotal}</strong>
                </div>
              </div>
            );
          })}
        </div>

        <div className="checkout-breakdown">
          <div>
            <span>Subtotal</span>
            <strong>Rs {total}</strong>
          </div>
          <div>
            <span>Delivery</span>
            <strong>Free</strong>
          </div>
          <div>
            <span>Cleaning</span>
            <strong>Included</strong>
          </div>
        </div>

        <div className="checkout-total">
          <div>
            <span>Payment method</span>
            <strong>Cash on Delivery</strong>
          </div>
          <div>
            <span>Total payable</span>
            <strong>Rs {total}</strong>
          </div>
        </div>

        <div className="checkout-trust-strip">
          <span>Cleaned and quality checked</span>
          <span>Pickup included</span>
          <span>Support available</span>
        </div>
      </aside>
    </div>
  );
}

export default Payment;
