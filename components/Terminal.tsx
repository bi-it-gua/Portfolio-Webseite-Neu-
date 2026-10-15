"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { about, experience, profile, projects, skills } from "@/data/content";

type Line = { kind: "in" | "out" | "err"; text: string };

const files: Record<string, string> = {
  "about.md": about,
  "skills.json": JSON.stringify(skills),
  "experience.log": experience.map((e) => `${e.period.padEnd(13)} ${e.role} @ ${e.company}`).join("\n"),
  "contact.txt": `${profile.email}\n${profile.socials.map((s) => `${s.label}: ${s.href}`).join("\n")}`,
};

const sections = ["about", "work", "skills", "experience", "contact"];

function run(raw: string): Line[] | "clear" | "exit" {
  const [cmd, ...args] = raw.trim().split(/\s+/);
  const arg = args.join(" ");
  const out = (text: string): Line[] => [{ kind: "out", text }];

  switch (cmd) {
    case "":
      return [];
    case "help":
      return out(
        [
          "whoami            who is this?",
          "ls                list files",
          "cat <file>        print a file",
          "projects          list projects",
          "goto <section>    " + sections.join(" | "),
          "open <social>     " + profile.socials.map((s) => s.label.toLowerCase()).join(" | "),
          "date              current date",
          "clear / exit      clean up / close",
          "sudo hire-me      you know what to do",
        ].join("\n"),
      );
    case "whoami":
      return out(`${profile.firstName} ${profile.lastName} — ${profile.title}\n${profile.germanTitle}`);
    case "ls":
      return out(Object.keys(files).join("   ") + "   projects/");
    case "cat":
      if (files[arg]) return out(files[arg]);
      return [{ kind: "err", text: `cat: ${arg || "?"}: no such file` }];
    case "projects":
    case "ls projects/":
      return out(projects.map((p) => `${p.no}  ${p.title.padEnd(16)} ${p.tags.join(", ")}`).join("\n"));
    case "goto": {
      const id = arg === "projects" ? "work" : arg;
      const el = document.getElementById(id);
      if (!el) return [{ kind: "err", text: `goto: unknown section '${arg}'` }];
      el.scrollIntoView({ behavior: "smooth" });
      return "exit";
    }
    case "open": {
      const s = profile.socials.find((x) => x.label.toLowerCase() === arg.toLowerCase());
      if (!s) return [{ kind: "err", text: `open: unknown target '${arg}'` }];
      window.open(s.href, "_blank", "noopener");
      return out(`opening ${s.label}…`);
    }
    case "date":
      return out(new Date().toString());
    case "echo":
      return out(arg);
    case "clear":
      return "clear";
    case "exit":
      return "exit";
    case "sudo":
      if (arg === "hire-me") {
        window.location.href = `mailto:${profile.email}?subject=Let's%20work%20together`;
        return out("🔓 access granted. opening your mail client…");
      }
      if (arg.startsWith("rm")) return out("nice try. 😏");
      return [{ kind: "err", text: "sudo: permission denied (but try 'sudo hire-me')" }];
    default:
      return [{ kind: "err", text: `command not found: ${cmd}. type 'help'.` }];
  }
}

const welcome: Line[] = [{ kind: "out", text: "atif-os v1.0 — type 'help' to see what you can do." }];

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(welcome);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = run(input);
    const echo: Line = { kind: "in", text: input };
    if (input.trim()) setHistory((h) => [input, ...h]);
    setHIndex(-1);
    setInput("");
    if (result === "clear") setLines([]);
    else if (result === "exit") {
      setLines((l) => [...l, echo]);
      setOpen(false);
    } else setLines((l) => [...l, echo, ...result]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const i = Math.min(history.length - 1, hIndex + 1);
      setHIndex(i);
      setInput(history[i]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const i = hIndex - 1;
      setHIndex(Math.max(-1, i));
      setInput(i < 0 ? "" : history[i]);
    }
  };

  return (
    <>
      <button className="term-toggle mono" onClick={() => setOpen((v) => !v)} aria-label="Open terminal">
        &gt;_
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="term-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="term"
              role="dialog"
              aria-label="Terminal"
              initial={{ y: 40, scale: 0.96, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 40, scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.focus();
              }}
            >
              <div className="term-bar mono">
                <span className="term-dots">
                  <i /> <i /> <i />
                </span>
                <span>{profile.handle}@portfolio: ~</span>
                <span className="muted">esc</span>
              </div>
              <div ref={bodyRef} className="term-body mono">
                {lines.map((l, i) => (
                  <pre key={i} className={`term-line term-${l.kind}`}>
                    {l.kind === "in" && <span className="accent">~$ </span>}
                    {l.text}
                  </pre>
                ))}
                <form onSubmit={submit} className="term-input">
                  <span className="accent">~$</span>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    spellCheck={false}
                    autoComplete="off"
                    aria-label="Terminal input"
                  />
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
