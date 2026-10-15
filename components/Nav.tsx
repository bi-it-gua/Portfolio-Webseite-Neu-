"use client";
import { useEffect, useState } from "react";

function RollLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} className="roll">
      <span>{children}</span>
      <span aria-hidden>{children}</span>
    </a>
  );
}

export default function Nav() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="nav">
      <a href="#top" className="nav-logo">
        AE<sup>©</sup>
      </a>
      <nav className="nav-links">
        <RollLink href="#work">Work</RollLink>
        <RollLink href="#about">About</RollLink>
        <RollLink href="#contact">Contact</RollLink>
      </nav>
      <span className="nav-time mono">{time}</span>
    </header>
  );
}
