import { Link, NavLink } from "react-router-dom";
import { isLoggedIn, logout } from "../utils/auth";

function Header() {
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

  return (
        <header className="app-header sticky top-0 z-50 bg-white/80 backdrop-blur-md">   
        <div className="header-inner">
        <Link to="/" className="brand-title">
          Clothify
        </Link>

        <nav className="navbar">
          <NavLink to="/" className={navClass}>Home</NavLink>
          <NavLink to="/shop" className={navClass}>Shop</NavLink>
          <NavLink to="/cart" className={navClass}>Cart</NavLink>
          <NavLink to="/my-rentals" className={navClass}>My Rentals</NavLink>

          {role === "admin" && (
            <NavLink to="/admin" className={navClass}>Add Cloths</NavLink>
          )}

          {!isLoggedIn() && (
            <>
              <NavLink to="/login" className={navClass}>Login</NavLink>
              <NavLink to="/signup" className={navClass}>Signup</NavLink>
            </>
          )}

          {isLoggedIn() && (
            <button onClick={logout} className="btn-logout">
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
