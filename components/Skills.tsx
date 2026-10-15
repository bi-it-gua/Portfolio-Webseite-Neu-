"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { skills } from "@/data/content";
import SectionLabel from "./SectionLabel";

export default function Skills() {
  const boxRef = useRef<HTMLDivElement>(null);
  // On touch screens dragging would hijack page scrolling, so it's mouse-only.
  const [canDrag, setCanDrag] = useState(false);

  useEffect(() => {
    setCanDrag(window.matchMedia("(pointer: fine)").matches);
  }, []);

  return (
    <section className="section skills" id="skills">
      <div className="skills-head">
        <SectionLabel index="03" path="skills.json" />
        {canDrag && <p className="muted mono">drag &amp; throw them around →</p>}
      </div>
      <div ref={boxRef} className="skills-box">
        {skills.map((s, i) => (
          <motion.span
            key={s}
            className="chip"
            data-cursor={canDrag ? "drag" : undefined}
            drag={canDrag}
            dragConstraints={boxRef}
            dragElastic={0.25}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 12 }}
            initial={{ opacity: 0, y: 40, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: ((i * 37) % 14) - 7 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ delay: i * 0.04, type: "spring", stiffness: 200, damping: 16 }}
            whileHover={{ scale: 1.08 }}
            whileDrag={{ scale: 1.15, zIndex: 10 }}
          >
            {s}
          </motion.span>
        ))}
      </div>
    </section>
  );
}
