"use client";

import { useEffect, useId, useState, type MouseEvent } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { nav } from "@/lib/site";

function unlockPage() {
  document.documentElement.style.overflow = "";
  document.getElementById("periexomeno")?.removeAttribute("inert");
  document.querySelector("footer")?.removeAttribute("inert");
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const main = document.getElementById("periexomeno");
    const footer = document.querySelector("footer");
    main?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");
    document.documentElement.style.overflow = "hidden";

    const root = document.getElementById("site-nav");
    const focusable = root
      ? Array.from(root.querySelectorAll<HTMLElement>("a, button"))
      : [];
    const panelLinks = focusable.filter((el) => el.closest(".nav-panel"));
    panelLinks[0]?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockPage();
    };
  }, [open]);

  function close() {
    setOpen(false);
    unlockPage();
  }

  function goTo(event: MouseEvent<HTMLAnchorElement>, id: string) {
    close();
    if (window.location.pathname !== "/") return;
    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
    window.history.pushState(null, "", `/#${id}`);
  }

  function startProject(event: MouseEvent<HTMLAnchorElement>) {
    close();
    if (window.location.pathname !== "/") return;
    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("epikoinonia")?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
    window.history.pushState(null, "", "/#epikoinonia");
  }

  return (
    <header className="site-header" id="site-nav">
      <div className="nav-bar">
        <Link className="logo-link" href="/#archi" aria-label="ORGANEXT, αρχική σελίδα" onClick={(event) => goTo(event, "archi")}>
          <Logo />
        </Link>
        <nav className="nav-links" aria-label="Κύρια πλοήγηση">
          {nav.map((item) => (
            <Link key={item.id} href={`/#${item.id}`} onClick={(event) => goTo(event, item.id)}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="btn btn-primary nav-cta" href="/#epikoinonia" onClick={startProject}>
          Ξεκινήστε ένα έργο
        </Link>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => (open ? close() : setOpen(true))}
        >
          <span className="sr-only">{open ? "Κλείσιμο μενού" : "Άνοιγμα μενού"}</span>
          <span className="nav-toggle-lines" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <i aria-hidden="true" />
        </button>
      </div>
      {open ? (
        <div className="nav-panel" id={panelId} role="dialog" aria-modal="true" aria-label="Κύριο μενού">
          <nav aria-label="Κινητή πλοήγηση">
            {nav.map((item, index) => (
              <Link key={item.id} href={`/#${item.id}`} onClick={(event) => goTo(event, item.id)}>
                <span className="nav-panel-index">{String(index + 1).padStart(2, "0")}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <Link className="btn btn-primary nav-panel-cta" href="/#epikoinonia" onClick={startProject}>
            Ξεκινήστε ένα έργο
          </Link>
        </div>
      ) : null}
    </header>
  );
}
