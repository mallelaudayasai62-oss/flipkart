"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";

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
  const [signedIn, setSignedIn] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderedItems, setOrderedItems] = useState(0);

  useEffect(() => {
    setSignedIn(window.localStorage.getItem("flipkart-demo-session") === "demo-shopper");
    const savedCart = window.localStorage.getItem("flipkart-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart) as CartItem[]);
      } catch {
        window.localStorage.removeItem("flipkart-cart");
      }
    }
    setSessionReady(true);
  }, []);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );
  const delivery = total > 0 && total <= 999 ? 79 : 0;

  function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signedIn || !cart.length) return;

    const number = `DEMO-${Date.now().toString(36).toUpperCase()}`;
    const currentOrders = window.localStorage.getItem("flipkart-demo-orders");
    let orders: unknown[] = [];
    if (currentOrders) {
      try {
        const parsed: unknown = JSON.parse(currentOrders);
        if (Array.isArray(parsed)) orders = parsed;
      } catch {
        orders = [];
      }
    }
    orders.unshift({
      orderNumber: number,
      submittedAt: new Date().toISOString(),
      total: total + delivery,
      items: cart.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })),
      paymentStatus: "not processed",
    });
    window.localStorage.setItem("flipkart-demo-orders", JSON.stringify(orders));
    window.localStorage.removeItem("flipkart-cart");
    setOrderNumber(number);
    setOrderedItems(cart.reduce((count, item) => count + item.quantity, 0));
    setCart([]);
    setPlaced(true);
  }

  if (placed) {
    return (
      <main className="checkout-page">
        <header className="checkout-header"><Link className="brand" href="/"><span className="brand-mark">f<span>✳</span></span><span className="brand-word">flipkart<span className="brand-period">.</span></span></Link><span>CHECKOUT</span></header>
        <section className="order-success">
          <span>✓</span><p className="eyebrow">DEMO ORDER SUBMITTED</p><h1>Your order is <em>recorded.</em></h1><p>Order {orderNumber} · {orderedItems} item{orderedItems === 1 ? "" : "s"}. Saved in this browser only; no payment was processed.</p><Link href="/" className="checkout-button">Back to the good finds <span>↗</span></Link>
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
          {!sessionReady ? (
            <div className="checkout-empty"><p>Loading your bag…</p></div>
          ) : !cart.length ? (
            <div className="checkout-empty"><span>♡</span><h2>Your bag is empty</h2><p>Add a few lovely finds before checking out.</p><Link className="checkout-button" href="/">Explore the shop <span>↗</span></Link></div>
          ) : !signedIn ? (
            <div className="checkout-empty"><span>♙</span><h2>Sign in to continue</h2><p>Use the local demo session to submit a sample order. No password is needed.</p><Link className="checkout-button" href="/login?returnTo=%2Fcheckout">Continue to demo sign-in <span>↗</span></Link></div>
          ) : cart.length ? (
            <form className="delivery-form" onSubmit={placeOrder}>
              <h2>Review your order</h2>
              <p className="login-intro">Your bag and total are shown alongside this form.</p>
              <p className="demo-note">This is a local demo. No shipping details, credentials, or card data are requested or saved.</p>
              <button className="checkout-button place-order" type="submit">Submit demo order <span>↗</span></button>
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
            <div><span>Delivery</span><b className="free-delivery">{delivery ? money(delivery) : "Free"}</b></div>
            <div className="summary-total"><span>Total</span><b>{money(total + delivery)}</b></div>
          </div>
          <p className="summary-reassurance">♡ &nbsp;Easy returns within 7 days</p>
        </aside>
      </div>
    </main>
  );
}
