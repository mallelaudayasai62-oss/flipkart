"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [message, setMessage] = useState("");
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    setSignedIn(window.localStorage.getItem("flipkart-demo-session") === "demo-shopper");
  }, []);

  function continueAsDemoShopper() {
    window.localStorage.setItem("flipkart-demo-session", "demo-shopper");
    setSignedIn(true);
    const requestedPath = new URLSearchParams(window.location.search).get("returnTo");
    const destination = requestedPath
      ? new URL(requestedPath, window.location.origin)
      : new URL("/", window.location.origin);
    const returnTo =
      destination.origin === window.location.origin
        ? `${destination.pathname}${destination.search}${destination.hash}`
        : "/";
    setMessage("Demo session started in this browser. This is not identity verification.");
    window.location.assign(returnTo);
  }

  function endDemoSession() {
    window.localStorage.removeItem("flipkart-demo-session");
    setSignedIn(false);
    setMessage("Demo session ended.");
  }

  return (
    <main className="login-page">
      <div className="login-topbar">
        <Link className="brand" href="/">
          <span className="brand-mark">f<span>✳</span></span>
          <span className="brand-word">flipkart<span className="brand-period">.</span></span>
        </Link>
        <Link href="/" className="back-link">← Back to shopping</Link>
      </div>
      <div className="login-layout">
        <section className="login-welcome">
          <p className="eyebrow"><span /> YOUR HAPPY PLACE</p>
          <h1>Good to see<br /><em>you again.</em></h1>
          <p>Your favourites, little perks, and lovely finds are just a sign-in away.</p>
          <div className="login-decoration"><span>✳</span><b>Come on in.<br />We saved you a spot.</b></div>
        </section>
        <section className="login-card">
          <p className="eyebrow">WELCOME BACK</p>
          <h2>Continue as a demo shopper</h2>
          <p className="login-intro">No password or payment details are collected in this demo.</p>
          <button className="login-submit" type="button" onClick={continueAsDemoShopper}>Continue <span>↗</span></button>
          {message && <p className="login-message" role="status">{message}</p>}
          {signedIn && <p className="signup-copy"><button type="button" onClick={endDemoSession}>End demo session</button></p>}
          <p className="demo-note">This local demo session is stored in browser storage and is not secure authentication.</p>
        </section>
      </div>
      <footer className="login-footer"><span>© 2025 Flipkart</span><span>Made for the joy of finding.</span></footer>
    </main>
  );
}
