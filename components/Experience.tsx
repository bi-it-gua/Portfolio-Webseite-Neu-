"use client";
import { motion } from "framer-motion";
import { experience } from "@/data/content";
import SectionLabel from "./SectionLabel";

export default function Experience() {
  return (
    <section className="section experience" id="experience">
      <SectionLabel index="04" path="experience.log" />
      <ul className="exp-list">
        {experience.map((e, i) => (
          <motion.li
            key={e.company + e.role}
            className="exp-row"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="exp-period mono">{e.period}</span>
            <span className="exp-role">{e.role}</span>
            <span className="exp-company">{e.company}</span>
            <span className="exp-note mono">{e.note}</span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
