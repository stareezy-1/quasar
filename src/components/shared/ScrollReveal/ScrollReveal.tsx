"use client";

/**
 * ScrollReveal — IntersectionObserver scroll-in animation wrapper. SSR-safe:
 * elements start hidden and transition to visible when they enter the viewport.
 * Ported from next-gen-portfolio.
 */

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

export type RevealVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom"
  | "fade";

export interface ScrollRevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  threshold?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

const DELAY_MS: Record<number, number> = {
  1: 80,
  2: 160,
  3: 240,
  4: 320,
  5: 400,
  6: 480,
  7: 560,
  8: 640,
};

export function ScrollReveal({
  children,
  variant = "fade-up",
  delay,
  threshold = 0.08,
  as: Tag = "div",
  className,
  style,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setHidden(false);
      return;
    }
    const delayMs = delay ? DELAY_MS[delay] ?? 0 : 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          if (delayMs > 0) setTimeout(() => setHidden(false), delayMs);
          else setHidden(false);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, delay]);

  const transitionStyle: CSSProperties = {
    transition: getTransition(variant),
    ...(hidden ? getHiddenStyles(variant) : { opacity: 1, transform: "none" }),
    ...style,
  };

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      className={className}
      style={transitionStyle}
    >
      {children}
    </Tag>
  );
}

function getHiddenStyles(variant: RevealVariant): CSSProperties {
  switch (variant) {
    case "fade-up":
      return { opacity: 0, transform: "translateY(40px)" };
    case "fade-down":
      return { opacity: 0, transform: "translateY(-32px)" };
    case "fade-left":
      return { opacity: 0, transform: "translateX(-40px)" };
    case "fade-right":
      return { opacity: 0, transform: "translateX(40px)" };
    case "zoom":
      return { opacity: 0, transform: "scale(0.85)" };
    case "fade":
      return { opacity: 0 };
  }
}

function getTransition(variant: RevealVariant): string {
  const spring = "cubic-bezier(0.16, 1, 0.3, 1)";
  const bounce = "cubic-bezier(0.34, 1.56, 0.64, 1)";
  const easing = variant === "zoom" ? bounce : spring;
  if (variant === "fade") return "opacity 0.8s ease";
  return `opacity 0.6s ${easing}, transform 0.6s ${easing}`;
}
