import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { isLoggedIn, logout } from "../utils/auth";

const utilityLinks = [
  { label: "New Arrivals", to: "/shop?sort=newest" },
  { label: "Wedding Edit", to: "/shop?occasion=Wedding" },
  { label: "Support", to: "/profile" },
];

const mobileShopShortcuts = [
  { label: "Filter", to: "/shop?mobilePanel=filters" },
  { label: "Sort By", to: "/shop?mobilePanel=sort" },
  { label: "All", to: "/shop" },
  { label: "Wedding", to: "/shop?occasion=Wedding" },
  { label: "Recommended", to: "/shop?sort=newest" },
  { label: "More", to: "/shop?mobilePanel=more" },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const loggedIn = isLoggedIn();
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

  const closeMenu = () => setMenuOpen(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = search.trim();
    navigate(query ? `/shop?q=${encodeURIComponent(query)}` : "/shop");
    closeMenu();
  };

  const handleLogout = () => {
    logout();
    closeMenu();
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

          <div className="header-mobile-actions" aria-label="Quick actions">
            <Link to="/cart" className="header-mobile-icon" onClick={closeMenu} aria-label="Cart">
              <span className="header-mobile-icon-glyph header-mobile-icon-glyph-bag" aria-hidden="true"></span>
              {cartCount ? <em className="header-mobile-icon-badge">{cartCount}</em> : null}
            </Link>
            <Link
              to={loggedIn ? "/profile" : "/login"}
              className="header-mobile-icon"
              onClick={closeMenu}
              aria-label={loggedIn ? "Profile" : "Login"}
            >
              <span className="header-mobile-icon-glyph header-mobile-icon-glyph-user" aria-hidden="true"></span>
            </Link>
          </div>

          <form className="header-search" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sherwani, lehenga, kurta set..."
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
            aria-controls="primary-navigation"
            aria-label="Toggle navigation"
          >
            <span className={`header-menu-btn-lines ${menuOpen ? "is-open" : ""}`} aria-hidden="true">
              <i></i>
              <i></i>
              <i></i>
            </span>
            <span className="header-menu-btn-label">{menuOpen ? "Close" : "Menu"}</span>
          </button>
        </div>

        <div className="page-shell">
          <div id="primary-navigation" className={`navbar ${menuOpen ? "navbar-open" : ""}`}>
            <div className="mobile-shop-shortcuts" aria-label="Mobile shop shortcuts">
              {mobileShopShortcuts.map((item) => (
                <Link key={item.label} to={item.to} className="mobile-shop-shortcut" onClick={closeMenu}>
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="navbar-secondary desktop-navbar-links">
              <NavLink to="/" className={navClass} onClick={closeMenu}>Home</NavLink>
              <NavLink to="/shop" className={navClass} onClick={closeMenu}>Shop All</NavLink>
              <NavLink to="/my-rentals" className={navClass} onClick={closeMenu}>My Rentals</NavLink>
              {loggedIn && (
                <NavLink to="/profile" className={navClass} onClick={closeMenu}>Profile</NavLink>
              )}
              {role === "admin" && (
                <NavLink to="/admin" className={navClass} onClick={closeMenu}>Admin</NavLink>
              )}
              {!loggedIn && (
                <NavLink to="/signup" className={navClass} onClick={closeMenu}>Signup</NavLink>
              )}
              {loggedIn && (
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <nav className="header-mobile-bottom-nav" aria-label="Mobile bottom navigation">
        <NavLink to="/" className={navClass} onClick={closeMenu}>
          <span className="header-bottom-icon header-bottom-icon-home" aria-hidden="true"></span>
          <small>Home</small>
        </NavLink>
        <NavLink to="/shop" className={navClass} onClick={closeMenu}>
          <span className="header-bottom-icon header-bottom-icon-shop" aria-hidden="true"></span>
          <small>Browse</small>
        </NavLink>
        <NavLink to="/wishlist" className={navClass} onClick={closeMenu}>
          <span className="header-bottom-icon header-bottom-icon-save" aria-hidden="true"></span>
          <small>Saved</small>
          {wishlistCount ? <em>{wishlistCount}</em> : null}
        </NavLink>
        <NavLink to={loggedIn ? "/profile" : "/login"} className={navClass} onClick={closeMenu}>
          <span className="header-bottom-icon header-bottom-icon-user" aria-hidden="true"></span>
          <small>{loggedIn ? "Account" : "Login"}</small>
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
