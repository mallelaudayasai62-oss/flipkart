"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  quantity: number;
};

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    const savedCart = window.localStorage.getItem("flipkart-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart) as CartItem[]);
      } catch {
        window.localStorage.removeItem("flipkart-cart");
      }
    }
  }, []);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  function placeOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.localStorage.removeItem("flipkart-cart");
    setCart([]);
    setPlaced(true);
  }

  if (placed) {
    return (
      <main className="checkout-page">
        <header className="checkout-header"><Link className="brand" href="/"><span className="brand-mark">f<span>✳</span></span><span className="brand-word">flipkart<span className="brand-period">.</span></span></Link><span>CHECKOUT</span></header>
        <section className="order-success">
          <span>✓</span><p className="eyebrow">ALL WRAPPED UP</p><h1>Your order is <em>on its way.</em></h1><p>Thanks for shopping with us. This is a demo checkout — no payment was taken.</p><Link href="/" className="checkout-button">Back to the good finds <span>↗</span></Link>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <header className="checkout-header">
        <Link className="brand" href="/"><span className="brand-mark">f<span>✳</span></span><span className="brand-word">flipkart<span className="brand-period">.</span></span></Link>
        <span>CHECKOUT <b>·</b> SECURE & SIMPLE</span>
        <Link href="/" className="back-link">← Keep shopping</Link>
      </header>
      <div className="checkout-content">
        <div className="checkout-main">
          <p className="eyebrow"><span /> ALMOST YOURS</p>
          <h1>Let’s get it <em>to you.</em></h1>
          {cart.length ? (
            <form className="delivery-form" onSubmit={placeOrder}>
              <h2>Delivery details</h2>
              <div className="field-row">
                <label>Full name<input required autoComplete="name" placeholder="Your name" /></label>
                <label>Phone number<input required type="tel" autoComplete="tel" minLength={10} placeholder="10-digit mobile number" /></label>
              </div>
              <label>Email address<input required type="email" autoComplete="email" placeholder="you@example.com" /></label>
              <label>Delivery address<textarea required autoComplete="street-address" rows={3} placeholder="House / flat number, street, area" /></label>
              <div className="field-row">
                <label>City<input required autoComplete="address-level2" placeholder="City" /></label>
                <label>PIN code<input required inputMode="numeric" minLength={6} maxLength={6} placeholder="6-digit PIN code" /></label>
              </div>
              <button className="checkout-button place-order" type="submit">Place demo order <span>↗</span></button>
              <p className="demo-note">Demo checkout only — no payment will be collected.</p>
            </form>
          ) : (
            <div className="checkout-empty"><span>♡</span><h2>Your bag is empty</h2><p>Add a few lovely finds before checking out.</p><Link className="checkout-button" href="/">Explore the shop <span>↗</span></Link></div>
          )}
        </div>
        <aside className="order-summary">
          <h2>Your bag <span>({cart.reduce((sum, item) => sum + item.quantity, 0)})</span></h2>
          {cart.map((item) => (
            <div className="summary-item" key={item.id}>
              <div className="summary-image"><Image src={item.image} alt="" fill sizes="64px" /></div>
              <div><b>{item.name}</b><span>Qty {item.quantity}</span></div>
              <strong>{money(item.price * item.quantity)}</strong>
            </div>
          ))}
          <div className="summary-lines">
            <div><span>Subtotal</span><b>{money(total)}</b></div>
            <div><span>Delivery</span><b className="free-delivery">{total > 999 || total === 0 ? "Free" : money(79)}</b></div>
            <div className="summary-total"><span>Total</span><b>{money(total + (total > 0 && total <= 999 ? 79 : 0))}</b></div>
          </div>
          <p className="summary-reassurance">♡ &nbsp;Easy returns within 7 days</p>
        </aside>
      </div>
    </main>
  );
}
