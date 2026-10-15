"use client";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/content";
import SectionLabel from "./SectionLabel";

type Project = (typeof projects)[number];
const artVariants = ["orbit", "bars", "blob", "dots"] as const;

function ProjectCard({ p, index }: { p: Project; index: number }) {
  const rx = useSpring(0, { stiffness: 150, damping: 15 });
  const ry = useSpring(0, { stiffness: 150, damping: 15 });

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.a
      href={p.href}
      className="project-card"
      data-cursor="view"
      style={{ rotateX: rx, rotateY: ry, ["--c" as string]: p.color }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className={`project-art art-${artVariants[index % artVariants.length]}`} aria-hidden>
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="project-head mono">
        <span>{p.no}</span>
        <span>{p.context}</span>
        <span>{p.year}</span>
      </div>
      <div className="project-body">
        <h3>{p.title}</h3>
        <p>{p.desc}</p>
        <ul className="tags mono">
          {p.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </motion.a>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section ref={sectionRef} className="projects" id="work" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="projects-sticky">
        <motion.div ref={trackRef} className="projects-track" style={{ x }}>
          <div className="projects-intro">
            <SectionLabel index="02" path="projects/" />
            <h2 className="big-title">
              Selected <span className="serif accent">work</span>
            </h2>
            <p className="muted mono">keep scrolling →</p>
          </div>
          {projects.map((p, i) => (
            <ProjectCard key={p.no} p={p} index={i} />
          ))}
        </motion.div>
        <div className="projects-progress">
          <motion.span style={{ scaleX: progress }} />
        </div>
      </div>
    </section>
  );
}
