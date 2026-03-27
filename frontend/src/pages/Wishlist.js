import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Productcard from "../components/Productcard";
import { getWishlist } from "../services/authService";
import { setWishlist } from "../features/wishlistSlice";

function Wishlist() {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setLoading(true);
        const res = await getWishlist();
        dispatch(setWishlist(res.data.items || []));
      } catch (err) {
        console.log(err);
        setError("Unable to load your wishlist right now.");
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [dispatch]);

  return (
    <div className="space-y-4">
      <div className="page-header">
        <h1 className="title-serif text-3xl">Wishlist</h1>
        <p className="text-gray-600 mt-1">Save styles you want to revisit before booking.</p>
      </div>

      {error && <p className="msg-error">{error}</p>}
      {loading && <div className="surface p-6 text-gray-600">Loading wishlist...</div>}
      {!loading && wishlist.length === 0 && (
        <div className="surface p-6 text-gray-600">No saved items yet. Start adding favorites from the shop.</div>
      )}

      <div className="shopx-grid">
        {!loading && wishlist.map((item) => (
          <Productcard key={item._id} item={item} refreshClothes={() => {}} />
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
