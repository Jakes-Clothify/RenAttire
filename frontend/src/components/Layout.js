import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Header from "./Header";
import Footer from "./Footer";
import { isLoggedIn } from "../utils/auth";
import { getWishlist } from "../services/authService";
import { setWishlist } from "../features/wishlistSlice";


function Layout({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const syncWishlist = async () => {
      if (!isLoggedIn()) {
        dispatch(setWishlist([]));
        return;
      }

      try {
        const res = await getWishlist();
        dispatch(setWishlist(res.data.items || []));
      } catch {
        // Keep local wishlist state if the request fails.
      }
    };

    syncWishlist();
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="page-shell flex-1 pt-4">
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default Layout;
