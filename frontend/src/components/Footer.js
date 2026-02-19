import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-20 border-t border-black/10 bg-white/70 backdrop-blur-md">
      <div className="page-shell py-12 grid gap-10 md:grid-cols-4">

        {/* BRAND */}
        <div>
          <h3 className="title-serif text-2xl mb-3">Clothify</h3>
          <p className="text-gray-600 text-sm">
            Rent premium outfits for every occasion.
            Look rich without spending rich.
          </p>
        </div>

        {/* NAVIGATION */}
        <div>
          <h4 className="font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/my-rentals">My Rentals</Link></li>
          </ul>
        </div>

        {/* HELP */}
        <div>
          <h4 className="font-semibold mb-3">Help</h4>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>How Renting Works</li>
            <li>Size Guide</li>
            <li>Return Policy</li>
            <li>Support</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>Email: support@clothify.com</li>
            <li>Phone: +91 99999 99999</li>
            <li>Pune, India</li>
          </ul>
        </div>

      </div>

      <div className="text-center text-sm text-gray-500 pb-6">
        © {new Date().getFullYear()} Clothify. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
