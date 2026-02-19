import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cloth, setCloth] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // fetch product
  useEffect(() => {
    const fetchCloth = async () => {
      try {
        const res = await axios.get(`/api/clothes/${id}`);
        setCloth(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCloth();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!cloth) return <p>Product not found</p>;

  const totalPrice = cloth.pricePerDay * days;

  // rent function
  const rentNow = async () => {
    if (!selectedSize) {
      setMsg("Please select size");
      return;
    }

    try {
      await axios.post("/api/rentals", {
        clothId: cloth._id,
        size: selectedSize,
        days
      });

      navigate("/my-rentals");
    } catch (err) {
      setMsg(err.response?.data?.message || "Rental failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>{cloth.name}</h1>

      <img src={cloth.image} alt="" width={300} />

      <p>Price per day: ₹{cloth.pricePerDay}</p>

      <h3>Select Size</h3>
      {cloth.availableSizes.map((s, i) => (
        <button
          key={i}
          onClick={() => setSelectedSize(s.measurements)}
          style={{
            margin: 5,
            background: selectedSize === s.measurements ? "black" : "white",
            color: selectedSize === s.measurements ? "white" : "black"
          }}
        >
          {Object.entries(s.measurements).map(([k, v]) => `${k}:${v} `)}
        </button>
      ))}

      <h3>Days</h3>
      <input
        type="number"
        min="1"
        value={days}
        onChange={(e) => setDays(Number(e.target.value))}
      />

      <h2>Total: ₹{totalPrice}</h2>

      <button onClick={rentNow}>Rent Now</button>

      <p>{msg}</p>
    </div>
  );
}
