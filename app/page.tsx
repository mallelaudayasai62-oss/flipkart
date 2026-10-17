"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { categories, products, type Product } from "@/lib/catalog";

type CartItem = Product & { quantity: number };

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All finds");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [ready, setReady] = useState(false);
  const [demoSignedIn, setDemoSignedIn] = useState(false);

  useEffect(() => {
    setDemoSignedIn(
      window.localStorage.getItem("flipkart-demo-session") === "demo-shopper",
    );
    const savedCart = window.localStorage.getItem("flipkart-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart) as CartItem[]);
      } catch {
        window.localStorage.removeItem("flipkart-cart");
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem("flipkart-cart", JSON.stringify(cart));
  }, [cart, ready]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        category === "All finds" || product.category === category;
      const matchesQuery =
        !normalizedQuery ||
        `${product.name} ${product.category}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setNotice(`${product.name} added to your bag`);
    window.setTimeout(() => setNotice(""), 2600);
  }

  function updateQuantity(productId: number, delta: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function buyNow(product: Product) {
    addToCart(product);
    setCartOpen(true);
  }

  return (
    <main>
      <div className="announcement">
        <span>THE LITTLE THINGS, DELIVERED WITH A LOT OF LOVE</span>
        <span>Free delivery on orders over ₹999&nbsp; · &nbsp; Easy 7-day returns</span>
      </div>

      <header className="site-header">
        <Link className="brand" href="/" aria-label="Flipkart home">
          <span className="brand-mark">f<span>✳</span></span>
          <span className="brand-word">flipkart<span className="brand-period">.</span></span>
        </Link>

        <form className="search" onSubmit={(event) => event.preventDefault()}>
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input
            aria-label="Search products"
            placeholder="Search for something lovely..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button
              className="clear-search"
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
            >
              ×
            </button>
          )}
          <button className="search-submit" type="submit">Search</button>
        </form>

        <nav className="header-actions" aria-label="Main navigation">
          <Link className="login-link" href="/login">
            <span className="person-icon" aria-hidden="true">♙</span>
            <span>{demoSignedIn ? "Demo account" : "Login"}</span>
          </Link>
          <button
            className="cart-trigger"
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Open shopping bag, ${cartCount} items`}
          >
            <span className="bag-icon" aria-hidden="true">▱</span>
            <span>Bag</span>
            <span className="cart-count">{cartCount}</span>
          </button>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span /> YOUR EVERYDAY, A LITTLE MORE EXTRA</p>
          <h1>Good things.<br /><em>Great finds.</em></h1>
          <p className="hero-description">
            A happy place for the things you love, the things you need, and the
            little surprises in between.
          </p>
          <a href="#shop" className="hero-cta">Find your next favourite <span>↗</span></a>
          <div className="hero-proof">
            <div className="avatar-stack" aria-hidden="true">
              <span>J</span><span>M</span><span>A</span><span>+</span>
            </div>
            <span>Loved by 2M+ happy shoppers</span>
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-sun" />
          <div className="hero-note note-one">a little treat <span>♡</span></div>
          <Image
            className="hero-image"
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1300&q=90"
            alt="A curated collection of everyday fashion and accessories"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 54vw"
          />
          <div className="hero-note note-two"><span>✳</span> little joys, delivered</div>
          <div className="hero-sticker"><span>NEW</span><b>Season,<br />meet you.</b></div>
        </div>
        <div className="hero-index"><span>01</span> / 04</div>
      </section>

      <section className="perks" aria-label="Shopping benefits">
        <div><span className="perk-icon">✦</span><span><b>Good prices, always</b><small>Little wins on every order</small></span></div>
        <div><span className="perk-icon">↗</span><span><b>Fast, free delivery</b><small>On orders over ₹999</small></span></div>
        <div><span className="perk-icon">♡</span><span><b>Easy-peasy returns</b><small>7 days, no questions</small></span></div>
      </section>

      <section className="shop-section" id="shop">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> THE GOOD STUFF</p>
            <h2>Fresh finds <em>for you</em></h2>
          </div>
          <p className="section-aside">Thoughtfully picked. Happily priced.<br />Yours to discover.</p>
        </div>

        <div className="category-row" aria-label="Filter by category">
          {categories.map((item) => (
            <button
              className={`category-pill${category === item.name ? " active" : ""}`}
              type="button"
              key={item.name}
              onClick={() => setCategory(item.name)}
              aria-pressed={category === item.name}
            >
              <span>{item.icon}</span>{item.name}
            </button>
          ))}
          <span className="result-count">{visibleProducts.length} lovely finds</span>
        </div>

        {visibleProducts.length ? (
          <div className="product-grid">
            {visibleProducts.map((product) => {
              const discount = Math.round(
                (1 - product.price / product.originalPrice) * 100,
              );
              return (
                <article className="product-card" key={product.id}>
                  <div className="product-photo" style={{ backgroundColor: product.color }}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 25vw"
                    />
                    <span className="product-badge">{product.badge}</span>
                    <button
                      className="wishlist"
                      type="button"
                      aria-label={`Save ${product.name} to wishlist`}
                      onClick={(event) => {
                        event.currentTarget.classList.toggle("saved");
                      }}
                    >
                      ♡
                    </button>
                    <button
                      className="quick-add"
                      type="button"
                      onClick={() => addToCart(product)}
                    >
                      + Add to bag
                    </button>
                  </div>
                  <div className="product-info">
                    <div className="product-category">{product.category}</div>
                    <h3>{product.name}</h3>
                    <div className="product-bottom">
                      <div className="price-wrap">
                        <b>{money(product.price)}</b>
                        <s>{money(product.originalPrice)}</s>
                        <span>{discount}% off</span>
                      </div>
                      <span className="rating"><span>★</span> {product.rating}</span>
                    </div>
                    <button
                      type="button"
                      className="buy-now-link"
                      onClick={() => buyNow(product)}
                    >
                      Buy now <span>↗</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-results">
            <span>⌕</span>
            <h3>No finds just yet</h3>
            <p>Try another search or choose a different category.</p>
            <button type="button" onClick={() => { setQuery(""); setCategory("All finds"); }}>
              Show all finds
            </button>
          </div>
        )}
      </section>

      <section className="bottom-banner">
        <span className="banner-spark">✳</span>
        <div><p className="eyebrow">A GOOD DAY TO TREAT YOURSELF</p><h2>Your next happy delivery is <em>right here.</em></h2></div>
        <a href="#shop">Keep exploring <span>↗</span></a>
      </section>

      <footer className="footer">
        <Link className="brand footer-brand" href="/">
          <span className="brand-mark">f<span>✳</span></span>
          <span className="brand-word">flipkart<span className="brand-period">.</span></span>
        </Link>
        <span>Find the little things that make a big day.</span>
        <span>© 2025 Flipkart. Made for the joy of finding.</span>
      </footer>

      {notice && <div className="toast" role="status"><span>✓</span>{notice}</div>}

      {cartOpen && (
        <div className="drawer-backdrop" onClick={() => setCartOpen(false)}>
          <aside
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="drawer-heading">
              <div><p className="eyebrow">YOUR LITTLE TREASURES</p><h2 id="cart-title">Your bag <span>({cartCount})</span></h2></div>
              <button type="button" className="close-drawer" aria-label="Close bag" onClick={() => setCartOpen(false)}>×</button>
            </div>
            {cart.length ? (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <div className="cart-item-image">
                        <Image src={item.image} alt="" fill sizes="84px" />
                      </div>
                      <div className="cart-item-info">
                        <span>{item.category}</span><b>{item.name}</b><strong>{money(item.price * item.quantity)}</strong>
                        <div className="quantity-control">
                          <button type="button" onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity">−</button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity">+</button>
                        </div>
                      </div>
                      <button className="remove-item" type="button" onClick={() => updateQuantity(item.id, -item.quantity)} aria-label={`Remove ${item.name}`}>×</button>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div><span>Subtotal</span><b>{money(cartTotal)}</b></div>
                  <p>Delivery is on us for orders over ₹999.</p>
                  <Link className="checkout-button" href="/checkout" onClick={() => setCartOpen(false)}>
                    Continue to checkout <span>↗</span>
                  </Link>
                  <button className="continue-shopping" type="button" onClick={() => setCartOpen(false)}>Keep exploring</button>
                </div>
              </>
            ) : (
              <div className="empty-cart">
                <span>♡</span><h3>Your bag is taking a little nap</h3>
                <p>Find something lovely and it’ll show up here.</p>
                <button type="button" onClick={() => setCartOpen(false)}>Explore finds</button>
              </div>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
