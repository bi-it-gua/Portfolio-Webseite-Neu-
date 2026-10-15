"use client";
import { motion, useSpring } from "framer-motion";
import { useState } from "react";
import { profile } from "@/data/content";
import SectionLabel from "./SectionLabel";

function Magnetic({ children, href }: { children: React.ReactNode; href: string }) {
  const x = useSpring(0, { stiffness: 180, damping: 14 });
  const y = useSpring(0, { stiffness: 180, damping: 14 });
  return (
    <motion.a
      href={href}
      className="magnetic"
      style={{ x, y }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.35);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.a>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <section className="section contact" id="contact">
      <SectionLabel index="05" path="contact.txt" />
      <h2 className="contact-title">
        Let&apos;s build
        <br />
        <span className="serif accent">something</span> together.
      </h2>

      <div className="contact-actions">
        <Magnetic href={`mailto:${profile.email}`}>Say hello</Magnetic>
        <div className="contact-side">
          <button className="copy mono" onClick={copy}>
            {copied ? "copied to clipboard ✓" : profile.email}
          </button>
          <ul className="socials">
            {profile.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="roll">
                  <span>{s.label} ↗</span>
                  <span aria-hidden>{s.label} ↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="footer mono">
        <span>© {new Date().getFullYear()} {profile.firstName} {profile.lastName}</span>
        <span className="muted only-desktop">psst — press ctrl + k</span>
        <span className="muted only-touch">psst — tap &gt;_</span>
        <a href="#top">back to top ↑</a>
      </footer>
    </section>
  );
}
