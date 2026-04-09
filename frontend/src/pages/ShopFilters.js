import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function ShopFilters() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const sizeOptions = ["chest", "waist", "shoulder", "hips", "length"];
  const typeOptions = ["Sherwani", "Lehenga", "Kurta", "Suit", "Casual", "Dress", "Jacket"];
  const occasionOptions = ["Wedding", "Party", "Ethnic", "Formal", "Traditional", "Festive"];
  const fitOptions = ["upper", "lower", "full", "footwear", "free"];

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [size, setSize] = useState(searchParams.get("size") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [occasion, setOccasion] = useState(searchParams.get("occasion") || "");
  const [fitProfile, setFitProfile] = useState(searchParams.get("fitProfile") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [onlyAvailable, setOnlyAvailable] = useState(searchParams.get("available") === "true");

  const handleApply = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (size) params.set("size", size);
    if (type) params.set("type", type);
    if (occasion) params.set("occasion", occasion);
    if (fitProfile) params.set("fitProfile", fitProfile);
    if (sort && sort !== "newest") params.set("sort", sort);
    if (onlyAvailable) params.set("available", "true");
    navigate(`/shop${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleReset = () => {
    setSearch("");
    setMaxPrice("");
    setSize("");
    setType("");
    setOccasion("");
    setFitProfile("");
    setSort("newest");
    setOnlyAvailable(false);
  };

  return (
    <div className="shopx-mobile-filter-page">
      <div className="shopx-mobile-sheet">
        <div className="shopx-mobile-panel-head">
          <div>
            <p className="shopx-mobile-kicker">Filters</p>
            <h1 className="title-serif text-3xl">Refine your picks</h1>
          </div>
          <button type="button" className="btn-outline" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>

        <div className="shopx-mobile-filter-stack">
          <label className="filter-label">Search</label>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="filter-input" placeholder="Search name, brand, fabric" />

          <label className="filter-label">Max Price / Day</label>
          <input type="number" min="0" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="filter-input" placeholder="e.g. 2500" />

          <label className="filter-label">Category Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="filter-select">
            <option value="">Any</option>
            {typeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>

          <label className="filter-label">Occasion</label>
          <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className="filter-select">
            <option value="">Any</option>
            {occasionOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>

          <label className="filter-label">Fit Profile</label>
          <select value={fitProfile} onChange={(e) => setFitProfile(e.target.value)} className="filter-select">
            <option value="">Any</option>
            {fitOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>

          <label className="filter-label">Size Measurement</label>
          <select value={size} onChange={(e) => setSize(e.target.value)} className="filter-select">
            <option value="">Any</option>
            {sizeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>

          <label className="filter-label">Sort</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="filter-select">
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
          </select>

          <label className="filter-checkbox">
            <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} />
            Available now only
          </label>

          <div className="shopx-mobile-actions-row">
            <button onClick={handleReset} className="btn-outline" type="button">
              Reset
            </button>
            <button onClick={handleApply} className="btn-brand" type="button">
              Show Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopFilters;
