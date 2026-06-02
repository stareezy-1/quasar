"use client";

/**
 * LottiePlayer — lightweight lottie renderer that uses the lottie-web library
 * loaded dynamically only on the client. Falls back to nothing if the browser
 * doesn't support it or if the fetch fails.
 *
 * We load lottie-web from the CDN only when the element enters the viewport
 * to keep the main bundle clean.
 */

import { useEffect, useRef } from "react";

export interface LottiePlayerProps {
  src: string;
  width?: number;
  height?: number;
  /** Opacity 0–1. */
  opacity?: number;
  loop?: boolean;
  autoplay?: boolean;
  /** Extra CSS class on the container div. */
  className?: string;
  style?: React.CSSProperties;
  decorative?: boolean;
}

export function LottiePlayer({
  src,
  width = 200,
  height = 200,
  opacity = 1,
  loop = true,
  autoplay = true,
  className,
  style,
  decorative = false,
}: LottiePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<{ destroy(): void } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    async function init() {
      try {
        // Dynamically import lottie-web only in the browser.
        const lottie = (await import("lottie-web")).default;
        const animData = await fetch(src).then((r) => r.json());
        if (cancelled || !containerRef.current) return;
        animRef.current = lottie.loadAnimation({
          container: containerRef.current,
          animationData: animData,
          renderer: "svg",
          loop,
          autoplay,
        });
      } catch {
        // Silently ignore — decorative only.
      }
    }

    // Only play when in viewport.
    if (typeof IntersectionObserver !== "undefined") {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            observer.disconnect();
            init();
          }
        },
        { threshold: 0.01 },
      );
      observer.observe(container);
      return () => {
        cancelled = true;
        observer.disconnect();
        animRef.current?.destroy();
      };
    } else {
      init();
      return () => {
        cancelled = true;
        animRef.current?.destroy();
      };
    }
  }, [src, loop, autoplay]);

  return (
    <div
      ref={containerRef}
      aria-hidden={decorative}
      className={className}
      style={{ width, height, opacity, ...style }}
    />
  );
}
