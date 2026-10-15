"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export const LOADER_DURATION = 2.1; // seconds, used by Hero to sync its entrance

const bootLines = [
  "[  OK  ] Mounting /dev/creativity",
  "[  OK  ] Loading coffee.service",
  "[  OK  ] Compiling projects (javac, dotnet, tsc)",
  "[  OK  ] Connecting to vocational-school.net",
  "[  OK  ] Starting portfolio.target",
];

export default function Loader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const start = performance.now();
    const total = LOADER_DURATION * 1000 - 300;
    let raf = 0;
    let timeout: ReturnType<typeof setTimeout>;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / total);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else timeout = setTimeout(() => setDone(true), 250);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (done) document.body.style.overflow = "";
  }, [done]);

  const visible = Math.min(bootLines.length, Math.floor((count / 100) * (bootLines.length + 0.5)));

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="loader"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="loader-top mono">
            <span>atif-os v1.0</span>
            <span>booting…</span>
          </div>
          <ul className="loader-lines mono">
            {bootLines.slice(0, visible).map((line) => (
              <li key={line}>
                <span className="ok">{line.slice(0, 8)}</span>
                {line.slice(8)}
              </li>
            ))}
            <li className="caret">_</li>
          </ul>
          <div className="loader-count">
            {count}
            <span className="serif">%</span>
          </div>
          <div className="loader-bar">
            <span style={{ transform: `scaleX(${count / 100})` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
