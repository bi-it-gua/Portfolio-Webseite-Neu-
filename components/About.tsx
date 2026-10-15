"use client";
import { animate, motion, MotionValue, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { about, stats } from "@/data/content";
import SectionLabel from "./SectionLabel";

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <span className="reveal-word">
      <motion.span style={{ opacity }}>{word}</motion.span>{" "}
    </span>
  );
}

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);
  return (
    <span ref={ref}>
      {n}
      <span className="serif accent">{suffix}</span>
    </span>
  );
}

export default function About() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = about.split(" ");

  return (
    <section className="section about" id="about">
      <SectionLabel index="01" path="about.md" />
      <p ref={ref} className="about-text">
        {words.map((w, i) => (
          <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
        ))}
      </p>
      <div className="stats">
        {stats.map((s) => (
          <div key={s.label} className="stat">
            <div className="stat-value">
              <Counter value={s.value} suffix={s.suffix} />
            </div>
            <div className="stat-label mono">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
