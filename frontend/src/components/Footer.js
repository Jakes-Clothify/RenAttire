import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-20 border-t border-black/10 bg-white/70 backdrop-blur-md">
      <div className="page-shell py-12 grid gap-10 md:grid-cols-4">
        <div>
          <h3 className="title-serif text-2xl mb-3">RenAttire</h3>
          <p className="text-gray-600 text-sm">
            Rent premium outfits for every occasion.
            Look rich without spending rich.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
            <li><Link to="/my-rentals">My Rentals</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Help</h4>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li><Link to="/shop">How Renting Works</Link></li>
            <li><Link to="/shop?fitProfile=upper">Size Guide</Link></li>
            <li><Link to="/my-rentals">Return Policy</Link></li>
            <li><Link to="/profile">Support</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>Email: support@renattire.com</li>
            <li>Phone: +91 99999 99999</li>
            <li>Pune, India</li>
          </ul>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 pb-6">
        Copyright {new Date().getFullYear()} RenAttire. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
