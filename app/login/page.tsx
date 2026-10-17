"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function submitLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(`Welcome back, ${email.split("@")[0]}! This demo sign-in is ready.`);
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
          <h2>Sign in to your account</h2>
          <p className="login-intro">Pick up right where your good finds left off.</p>
          <form onSubmit={submitLogin}>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <div className="password-label"><label htmlFor="password">Password</label><button type="button" onClick={() => setMessage("Password reset links are not enabled in this demo.")}>Forgot password?</button></div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button className="login-submit" type="submit">Sign in <span>↗</span></button>
          </form>
          {message && <p className="login-message" role="status">{message}</p>}
          <p className="signup-copy">New around here? <button type="button" onClick={() => setMessage("Account creation is not enabled in this demo.")}>Create an account</button></p>
          <p className="demo-note">Demo page only — no credentials are sent or stored.</p>
        </section>
      </div>
      <footer className="login-footer"><span>© 2025 Flipkart</span><span>Made for the joy of finding.</span></footer>
    </main>
  );
}
