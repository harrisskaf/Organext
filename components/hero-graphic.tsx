"use client";

import { useRef } from "react";

export function HeroGraphic() {
  const frame = useRef<HTMLDivElement>(null);

  function move(event: React.PointerEvent<HTMLDivElement>) {
    const node = frame.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.setProperty("--px", x.toFixed(3));
    node.style.setProperty("--py", y.toFixed(3));
  }

  function leave() {
    frame.current?.style.setProperty("--px", "0");
    frame.current?.style.setProperty("--py", "0");
  }

  return (
    <div className="hero-stage">
      <div
        className="hero-stage-frame"
        ref={frame}
        onPointerMove={move}
        onPointerLeave={leave}
        aria-hidden="true"
      >
        <svg className="hero-art" viewBox="0 0 560 448" aria-hidden="true">
          <rect x="86" y="36" width="390" height="286" rx="28" fill="#ffffff" stroke="#252B30" strokeOpacity="0.08" />
          <rect x="48" y="72" width="404" height="300" rx="26" fill="#ffffff" stroke="#252B30" strokeOpacity="0.12" />
          <rect x="48" y="72" width="404" height="48" rx="26" fill="#F5F7F8" />
          <rect x="48" y="100" width="404" height="20" fill="#F5F7F8" />
          <circle cx="76" cy="96" r="5" fill="#252B30" fillOpacity="0.28" />
          <circle cx="94" cy="96" r="5" fill="#252B30" fillOpacity="0.16" />
          <circle cx="112" cy="96" r="5" fill="#35C9CE" />
          <rect x="148" y="90" width="92" height="12" rx="6" fill="#252B30" fillOpacity="0.1" />
          <rect x="332" y="84" width="96" height="24" rx="12" fill="#35C9CE" />
          <rect x="72" y="142" width="118" height="86" rx="16" fill="#F5F7F8" />
          <rect x="88" y="158" width="36" height="8" rx="4" fill="#35C9CE" />
          <rect x="88" y="176" width="86" height="7" rx="3.5" fill="#252B30" fillOpacity="0.16" />
          <rect x="88" y="192" width="70" height="7" rx="3.5" fill="#252B30" fillOpacity="0.1" />
          <rect x="206" y="142" width="222" height="86" rx="16" fill="#ffffff" stroke="#252B30" strokeOpacity="0.08" />
          <path d="M224 204 C248 204 256 168 278 170 C300 172 308 150 332 154 C356 158 364 138 408 142 L408 210 L224 210 Z" fill="#35C9CE" fillOpacity="0.16" />
          <path d="M224 204 C248 204 256 168 278 170 C300 172 308 150 332 154 C356 158 364 138 408 142" fill="none" stroke="#35C9CE" strokeWidth="3" strokeLinecap="round" />
          <path d="M224 198 C252 196 270 186 294 188 C322 190 338 176 408 184" fill="none" stroke="#252B30" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
          <rect x="72" y="244" width="86" height="96" rx="16" fill="#252B30" />
          <rect x="88" y="262" width="40" height="8" rx="4" fill="#35C9CE" />
          <rect x="88" y="280" width="54" height="6" rx="3" fill="#ffffff" fillOpacity="0.35" />
          <rect x="88" y="296" width="42" height="6" rx="3" fill="#ffffff" fillOpacity="0.2" />
          <rect x="170" y="244" width="118" height="96" rx="16" fill="#F5F7F8" />
          <rect x="186" y="292" width="16" height="28" rx="4" fill="#252B30" fillOpacity="0.18" />
          <rect x="210" y="276" width="16" height="44" rx="4" fill="#252B30" fillOpacity="0.28" />
          <rect x="234" y="260" width="16" height="60" rx="4" fill="#35C9CE" />
          <rect x="258" y="284" width="16" height="36" rx="4" fill="#252B30" fillOpacity="0.18" />
          <rect x="300" y="228" width="214" height="150" rx="22" fill="#ffffff" stroke="#35C9CE" strokeOpacity="0.7" />
          <circle cx="348" cy="278" r="8" fill="#35C9CE" />
          <circle cx="418" cy="252" r="8" fill="#252B30" />
          <circle cx="470" cy="300" r="8" fill="#252B30" />
          <circle cx="392" cy="332" r="8" fill="#35C9CE" />
          <path d="M356 276 L410 256 M424 258 L462 296 M462 304 L400 330 M356 284 L386 326" fill="none" stroke="#252B30" strokeOpacity="0.28" strokeWidth="2" />
          <rect x="324" y="348" width="72" height="10" rx="5" fill="#35C9CE" />
          <rect x="406" y="348" width="84" height="10" rx="5" fill="#252B30" fillOpacity="0.1" />
        </svg>
      </div>
    </div>
  );
}
