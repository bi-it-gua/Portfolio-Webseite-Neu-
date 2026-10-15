"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { profile, roles } from "@/data/content";
import { LOADER_DURATION } from "./Loader";

const ease = [0.22, 1, 0.36, 1] as const;

// Each letter gets heavier the closer the mouse is to it.
function ProximityWord({ text, delay, className }: { text: string; delay: number; className?: string }) {
  const refs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    let mx = -9999;
    let my = -9999;
    const update = () => {
      raf = 0;
      refs.current.forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2));
        const t = Math.max(0, 1 - d / 380);
        el.style.fontVariationSettings = `"wght" ${300 + 400 * t}`;
        el.style.transform = `translateY(${-t * 4}%)`;
      });
    };
    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <span className={`hero-word ${className ?? ""}`} aria-label={text}>
      {text.split("").map((ch, i) => (
        <span key={i} className="hero-letter-mask" aria-hidden>
          <span ref={(el) => { refs.current[i] = el; }} className="hero-letter">
            <motion.span
              style={{ display: "inline-block" }}
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, ease, delay: delay + i * 0.05 }}
            >
              {ch}
            </motion.span>
          </span>
        </span>
      ))}
    </span>
  );
}

function RotatingRole() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % roles.length), 2400);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="rotator">
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[i]}
          className="serif accent"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease }}
        >
          {roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero() {
  const d = LOADER_DURATION + 0.3;
  return (
    <section className="hero" id="top">
      <div className="hero-grid" aria-hidden />
      <motion.p
        className="hero-prompt mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: d, duration: 0.6 }}
      >
        <span className="accent">{profile.handle}@portfolio</span>:~$ whoami<span className="blink">▍</span>
      </motion.p>

      <h1 className="hero-title">
        <ProximityWord text={profile.firstName} delay={d} />
        <ProximityWord text={profile.lastName} delay={d + 0.15} className="hero-word--indent" />
      </h1>

      <motion.div
        className="hero-bottom"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: d + 0.6, duration: 0.8, ease }}
      >
        <p className="hero-lead">
          {profile.title} — <RotatingRole />
          <br />
          <span className="muted">{profile.germanTitle}</span>
        </p>
        <div className="hero-meta mono">
          <span>
            <i className="status-dot" /> available for opportunities
          </span>
          <span>📍 {profile.location}</span>
          <span className="scroll-hint">scroll ↓</span>
        </div>
      </motion.div>
    </section>
  );
}
