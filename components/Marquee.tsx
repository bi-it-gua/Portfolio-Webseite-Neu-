"use client";
import {
  motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity,
} from "framer-motion";
import { useRef } from "react";
import { marquee } from "@/data/content";

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

// Scrolls on its own; scrolling the page speeds it up and flips its direction.
function VelocityRow({ baseVelocity, variant }: { baseVelocity: number; variant: "solid" | "outline" }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = dir.current * baseVelocity * (delta / 1000);
    if (factor.get() < 0) dir.current = -1;
    else if (factor.get() > 0) dir.current = 1;
    move += dir.current * move * factor.get();
    baseX.set(baseX.get() + move);
  });

  return (
    <div className={`marquee-row marquee-row--${variant}`}>
      <motion.div className="marquee-track" style={{ x }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} aria-hidden={i > 0}>
            {marquee.map((m) => (
              <span key={m} className="marquee-item">
                {m} <b>✦</b>
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="marquee">
      <VelocityRow baseVelocity={-2} variant="solid" />
      <VelocityRow baseVelocity={2} variant="outline" />
    </div>
  );
}
