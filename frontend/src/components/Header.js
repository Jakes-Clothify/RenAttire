import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { isLoggedIn, logout } from "../utils/auth";

const utilityLinks = [
  { label: "New Arrivals", to: "/shop?sort=newest" },
  { label: "Wedding Edit", to: "/shop?occasion=Wedding" },
  { label: "Support", to: "/profile" },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const cartCount = useSelector((state) => state.cart.length);
  const wishlistCount = useSelector((state) => state.wishlist.length);
  const navigate = useNavigate();

  const getRole = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role;
    } catch {
      return null;
    }
  };

  const role = getRole();

  const navClass = ({ isActive }) =>
    isActive ? "nav-link nav-link-active" : "nav-link";

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = search.trim();
    navigate(query ? `/shop?q=${encodeURIComponent(query)}` : "/shop");
    setMenuOpen(false);
  };

  return (
    <header className="app-header sticky top-0 z-50">
      <div className="header-utility">
        <div className="page-shell header-utility-inner">
          <p>
            <span className="header-utility-badge">Premium Rental</span>
            Rent premium fashion with verified cleaning, fit support, and easy returns.
          </p>
          <div className="header-utility-links">
            {utilityLinks.map((item) => (
              <Link key={item.label} to={item.to}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="header-main-shell">
        <div className="page-shell header-inner">
          <Link to="/" className="brand-title">
            <span className="brand-mark">R</span>
            <span className="brand-copy">
              <strong>RenAttire</strong>
              <span>Rental Studio</span>
            </span>
          </Link>

          <form className="header-search" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sherwani, lehenga, cocktail dress, kurta..."
              className="header-search-input"
            />
            <button type="submit" className="header-search-btn">
              Find
            </button>
          </form>

          <div className="header-actions">
            <Link to="/wishlist" className="header-action-pill">
              <small>Saved</small>
              Wishlist
              {wishlistCount ? <span>{wishlistCount}</span> : null}
            </Link>
            <Link to="/cart" className="header-action-pill">
              <small>Bag</small>
              Cart
              {cartCount ? <span>{cartCount}</span> : null}
            </Link>
            {isLoggedIn() ? (
              <Link to="/profile" className="header-action-pill">
                <small>You</small>
                Account
              </Link>
            ) : (
              <Link to="/login" className="header-action-pill">
                <small>Join</small>
                Login
              </Link>
            )}
          </div>

          <button
            type="button"
            className="header-menu-btn"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            Browse
          </button>
        </div>

        <div className="page-shell">
          <div className={`navbar ${menuOpen ? "navbar-open" : ""}`}>
            <div className="navbar-secondary">
              <NavLink to="/" className={navClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
              <NavLink to="/shop" className={navClass} onClick={() => setMenuOpen(false)}>Shop All</NavLink>
              <NavLink to="/my-rentals" className={navClass} onClick={() => setMenuOpen(false)}>My Rentals</NavLink>
              {isLoggedIn() && (
                <NavLink to="/profile" className={navClass} onClick={() => setMenuOpen(false)}>Profile</NavLink>
              )}
              {role === "admin" && (
                <NavLink to="/admin" className={navClass} onClick={() => setMenuOpen(false)}>Admin</NavLink>
              )}
              {!isLoggedIn() && (
                <NavLink to="/signup" className={navClass} onClick={() => setMenuOpen(false)}>Signup</NavLink>
              )}
              {isLoggedIn() && (
                <button onClick={logout} className="btn-logout">
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
