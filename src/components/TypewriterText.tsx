"use client";

import { useEffect, useRef, useState } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
}

export function TypewriterText({ text, speed = 28, className }: TypewriterTextProps) {
  const [charIndex, setCharIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const frameRef = useRef(0);

  useEffect(() => {
    try { setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches); } catch { /* SSR fallback */ }
  }, []);

  useEffect(() => {
    if (reducedMotion || !text) { setCharIndex(text.length); return; }
    setCharIndex(0);
    let elapsed = 0;
    const step = () => {
      elapsed += 1;
      const target = Math.min(text.length, Math.floor(elapsed * speed / 16));
      setCharIndex(target);
      if (target < text.length) frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [text, speed, reducedMotion]);

  const displayed = reducedMotion ? text : text.slice(0, charIndex);
  const cursor = charIndex < text.length && !reducedMotion;

  return (
    <span className={className}>
      <span aria-hidden="true">{displayed}{cursor && <span className="inline-block w-[2px] animate-pulse bg-[#3f5147] ml-[1px]" />}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
