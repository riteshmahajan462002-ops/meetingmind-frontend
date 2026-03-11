"use client";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "0 24px",
        transition: "all 0.3s ease",
        background: scrolled || menuOpen ? "var(--bg-primary)" : "transparent",
        backdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
        borderBottom: scrolled || menuOpen ? "1px solid var(--border-subtle)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "68px",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 15px var(--accent-glow)",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 1C8.13 1 5 4.13 5 8C5 12.5 12 23 12 23C12 23 19 12.5 19 8C19 4.13 15.87 1 12 1Z" fill="white" opacity="0.9" />
              <circle cx="12" cy="8" r="3" fill="white" />
            </svg>
          </div>
          <span
            style={{
              fontSize: "20px",
              fontWeight: "800",
              letterSpacing: "-0.5px",
              background: "linear-gradient(135deg, var(--text-primary), var(--accent-secondary))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            MeetingMind
          </span>
        </div>

        {/* Desktop Nav links */}
        <div
          className="hidden md:flex"
          style={{ alignItems: "center", gap: "8px" }}
        >
          {["Features", "How It Works", "Pricing"].map((item) => (
            <a
              key={item}
              href="#"
              style={{
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
                padding: "8px 16px",
                borderRadius: "8px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "var(--text-primary)";
                e.target.style.background = "var(--accent-glow)";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "var(--text-secondary)";
                e.target.style.background = "transparent";
              }}
            >
              {item}
            </a>
          ))}
          <button
            style={{
              marginLeft: "8px",
              background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
              color: "white",
              border: "none",
              padding: "9px 22px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 20px var(--accent-glow)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 30px var(--accent-glow)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 20px var(--accent-glow)";
            }}
          >
            Get Started Free
          </button>
        </div>

        {/* Mobile hamburger button */}
        <button
          className="flex md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            background: "transparent",
            border: "1px solid var(--border-subtle)",
            borderRadius: "8px",
            padding: "8px",
            cursor: "pointer",
            color: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="flex flex-col md:hidden"
          style={{
            padding: "16px 0 24px",
            borderTop: "1px solid var(--border-subtle)",
            gap: "4px",
          }}
        >
          {["Features", "How It Works", "Pricing"].map((item) => (
            <a
              key={item}
              href="#"
              onClick={() => setMenuOpen(false)}
              style={{
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontSize: "16px",
                fontWeight: "500",
                padding: "12px 16px",
                borderRadius: "10px",
                transition: "all 0.2s ease",
                display: "block",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "var(--text-primary)";
                e.target.style.background = "var(--accent-glow)";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "var(--text-secondary)";
                e.target.style.background = "transparent";
              }}
            >
              {item}
            </a>
          ))}
          <div style={{ padding: "8px 16px 0" }}>
            <button
              style={{
                width: "100%",
                background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                color: "white",
                border: "none",
                padding: "12px 22px",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Get Started Free
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
