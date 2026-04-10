import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getClothes } from "../services/clothService";
import Productcard from "../components/Productcard";

const heroSlides = [
  {
    kicker: "Wedding Season Edit",
    title: "Rent statement looks for every ceremony without buying a full wardrobe.",
    text: "Explore premium sherwanis, lehengas, gowns, and reception fits curated for modern event dressing.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop",
    ctaLabel: "Shop Wedding Wear",
    ctaLink: "/shop?occasion=Wedding",
    secondaryLabel: "Browse Designers",
    secondaryLink: "/shop?type=Sherwani",
  },
  {
    kicker: "Party And Cocktail",
    title: "Go from invite to outfit in minutes with premium rental styling.",
    text: "Discover sleek cocktail edits, sharp formal layers, and occasion-first looks delivered ready to wear.",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1600&auto=format&fit=crop",
    ctaLabel: "Shop Party Looks",
    ctaLink: "/shop?occasion=Party",
    secondaryLabel: "View Trending",
    secondaryLink: "/shop?sort=price_desc",
  },
  {
    kicker: "Festive Rotation",
    title: "Celebrate more, repeat less, and keep your wardrobe fresh all season.",
    text: "Traditional and festive styles with fit support, verified cleaning, and straightforward returns.",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1600&auto=format&fit=crop",
    ctaLabel: "Explore Festive Wear",
    ctaLink: "/shop?occasion=Festive",
    secondaryLabel: "Get Started",
    secondaryLink: "/signup",
  },
];

const spotlightCards = [
  {
    title: "Wedding Luxe",
    subtitle: "Premium sherwani and lehenga edits",
    image: "https://sethnik.com/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-19-at-7.22.22-PM.jpeg",
  },
  {
    title: "Party Edit",
    subtitle: "Modern fits for evening events",
    image: "https://www.stylejunkiie.com/cdn/shop/files/look02_3.jpg?v=1764662327&width=2803",
  },
  {
    title: "Festive Classic",
    subtitle: "Traditional wear with modern comfort",
    image: "https://successmenswear.com/cdn/shop/collections/Festive.jpg?v=1698924097",
  },
  {
    title: "Reception Select",
    subtitle: "Polished evening looks for grand celebrations",
    image: "https://millionairebombay.com/cdn/shop/files/Sideangle.jpg?v=1732635281",
  },
];

const categoryTiles = [
  { label: "Sherwani", meta: "Groom and reception picks", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuvc-jez6siIZBp7epeu61WE5mNOFpKDJMzQ&s", link: "/shop?type=Sherwani" },
  { label: "Lehenga", meta: "Wedding and sangeet edits", image: "https://empress-clothing.com/cdn/shop/files/AT13001.jpg?v=1724067504", link: "/shop?occasion=Wedding" },
  { label: "Party Wear", meta: "Cocktail and evening styles", image: "https://www.royalexport.in/product-img/premium-party-wear-ready-made--1734422706.jpg", link: "/shop?occasion=Party" },
  { label: "Festive", meta: "Modern traditional rotation", image: "https://www.labelmadhurithakkar.com/cdn/shop/files/IMG_5922_6ed3866e-dbdd-43dc-9d14-ddd5ab6f2fac_1400x.jpg?v=1739261758", link: "/shop?occasion=Festive" },
];

const valueProps = [
  { heading: "Premium Without Ownership", text: "Wear high-value styles for occasions without full-price buying." },
  { heading: "Fit + Care Confidence", text: "Measurement-first discovery with cleaning and quality checks included." },
  { heading: "Fast Rental Workflow", text: "Book online in minutes with straightforward pickup and return process." },
];

const trustStats = [
  { value: "98%", label: "On-time deliveries" },
  { value: "12K+", label: "Orders fulfilled" },
  { value: "7K+", label: "Happy renters" },
  { value: "24/7", label: "Support response" },
];

function HomeLanding() {
  const [trending, setTrending] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        setLoadingTrending(true);
        const res = await getClothes({ limit: 8 });
        setTrending(res.data.items || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingTrending(false);
      }
    };

    loadTrending();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const currentSlide = heroSlides[activeSlide];

  return (
    <div className="mixhome">
      <section className="mixhome-promo">
        <span>New User Offer</span>
        <p>Get up to 20% off on your first rental booking this week.</p>
      </section>

      <section className="mixhome-carousel">
        <div className="mixhome-carousel-media">
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop";
            }}
          />
          <div className="mixhome-carousel-overlay" />
        </div>

        <div className="mixhome-carousel-content">
          <p className="mixhome-kicker">{currentSlide.kicker}</p>
          <h1 className="title-serif">{currentSlide.title}</h1>
          <p className="mixhome-sub">{currentSlide.text}</p>

          <div className="mixhome-hero-actions">
            <Link to={currentSlide.ctaLink} className="btn-brand">{currentSlide.ctaLabel}</Link>
            <Link to={currentSlide.secondaryLink} className="btn-outline">{currentSlide.secondaryLabel}</Link>
          </div>

          <div className="mixhome-metrics">
            <article><strong>500+</strong><span>Live Catalog</span></article>
            <article><strong>4.9/5</strong><span>User Rating</span></article>
            <article><strong>48h</strong><span>Avg Fulfillment</span></article>
          </div>

          <div className="mixhome-carousel-dots">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                className={index === activeSlide ? "active" : ""}
                onClick={() => setActiveSlide(index)}
                aria-label={`Show slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mixhome-category-grid">
        {categoryTiles.map((tile) => (
          <Link key={tile.label} to={tile.link} className="mixhome-category-tile">
            <img
              src={tile.image}
              alt={tile.label}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000&auto=format&fit=crop";
              }}
            />
            <div>
              <strong>{tile.label}</strong>
              <span>{tile.meta}</span>
            </div>
          </Link>
        ))}
      </section>

      <section className="mixhome-proof">
        {trustStats.map((item) => (
          <article key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <section className="mixhome-spotlight">
        <div className="mixhome-section-head">
          <p>Spotlight Collections</p>
          <h2 className="title-serif">High-demand edits for real events</h2>
        </div>

        <div className="mixhome-spotlight-grid">
          {spotlightCards.map((card) => (
            <article className="mixhome-spotlight-card" key={card.title}>
              <img
                src={card.image}
                alt={card.title}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1400&auto=format&fit=crop";
                }}
              />
              <div className="mixhome-spotlight-overlay">
                <h3>{card.title}</h3>
                <p>{card.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mixhome-values">
        {valueProps.map((item) => (
          <article key={item.heading} className="mixhome-value-card">
            <h3>{item.heading}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="mixhome-trending">
        <div className="mixhome-section-head">
          <p>Trending Now</p>
          <h2 className="title-serif">Rent-ready picks your city is loving</h2>
        </div>

        <div className="mixhome-trending-row">
          {loadingTrending && <p className="muted">Loading trending styles...</p>}
          {!loadingTrending && trending.length === 0 && <p className="muted">No products available right now.</p>}
          {!loadingTrending && trending.map((item) => (
            <article key={item._id} className="mixhome-trending-item">
              <Productcard item={item} refreshClothes={() => {}} />
            </article>
          ))}
        </div>
      </section>

      <section className="mixhome-cta">
        <div>
          <p className="mixhome-kicker">Ready To Elevate Your Event Style?</p>
          <h2 className="title-serif">One platform. Premium looks. Smart rental value.</h2>
          <p>Start exploring curated outfits and book your first look in minutes.</p>
        </div>
        <div className="mixhome-cta-actions">
          <Link to="/shop" className="btn-brand">Browse Rentals</Link>
          <Link to="/login" className="btn-outline">Login</Link>
        </div>
      </section>
    </div>
  );
}

export default HomeLanding;
