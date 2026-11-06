"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

type HashLinkProps = {
  id: string;
  eidos?: string;
  className?: string;
  children: ReactNode;
  label?: string;
};

export function HashLink({ id, eidos, className, children, label }: HashLinkProps) {
  const router = useRouter();
  const href = eidos ? `/?eidos=${eidos}#${id}` : `/#${id}`;

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (window.location.pathname !== "/") return;
    event.preventDefault();
    if (eidos) router.push(href, { scroll: false });
    else window.history.pushState(null, "", href);
    document.getElementById(id)?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <Link href={href} className={className} aria-label={label} onClick={onClick}>
      {children}
    </Link>
  );
}
