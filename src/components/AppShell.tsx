"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useApp } from "@/components/AppProviders";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading, signOut, theme, toggleTheme } = useApp();
  const nav = [
    { href: "/events", label: "Find events" },
    ...(user ? [
      { href: "/create-event", label: "Create event" },
      { href: "/joined-events", label: "My commitments" },
      { href: "/manage-events", label: "Manage" },
    ] : []),
  ];

  return (
    <>
      <header className="site-header">
        <div className="nav-wrap">
          <Link className="brand" href="/" aria-label="Good Neighbors home">
            <span className="brand-mark"><span>g</span></span>
            <span>good<span className="brand-light">neighbors</span></span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {nav.map((item) => (
              <Link className="nav-link" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}>
              {theme === "light" ? "☾" : "☀"}
            </button>
            {loading ? <span className="nav-loading" /> : user ? (
              <>
                <Link className="avatar-link" href="/profile" aria-label="Your profile">
                  {user.imageUrl ? <img src={user.imageUrl} alt="" /> : user.name.charAt(0).toUpperCase()}
                </Link>
                <button className="button button-outline button-small signout" onClick={signOut}>Sign out</button>
              </>
            ) : (
              <>
                <Link className="nav-login" href="/login">Log in</Link>
                <Link className="button button-small" href="/register">Join the good</Link>
              </>
            )}
          </div>
        </div>
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <Link href="/events">Explore</Link>
          {user ? <><Link href="/joined-events">Joined</Link><Link href="/create-event">Create</Link><Link href="/manage-events">Manage</Link></> : <Link href="/login">Log in</Link>}
        </nav>
      </header>
      <main className="main-content">{children}</main>
      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <Link className="brand brand-footer" href="/"><span className="brand-mark"><span>g</span></span><span>good<span className="brand-light">neighbors</span></span></Link>
            <p>Small acts, stronger neighborhoods.<br />Find your people. Do a little good.</p>
          </div>
          <div className="footer-links">
            <div><span className="footer-label">Explore</span><Link href="/events">Upcoming events</Link><Link href="/#our-approach">Our approach</Link></div>
            <div><span className="footer-label">Get involved</span><Link href="/create-event">Host an event</Link><Link href="/register">Join the community</Link></div>
          </div>
          <div className="footer-note"><span className="footer-flower">✳</span><p>Better things happen<br />when we show up.</p></div>
        </div>
        <div className="footer-bottom"><span>Good Neighbors · Made for people who care.</span><span>Small acts, stronger neighborhoods.</span></div>
      </footer>
    </>
  );
}
