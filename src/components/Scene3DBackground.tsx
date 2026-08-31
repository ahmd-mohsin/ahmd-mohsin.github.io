"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/**
 * Scene3DBackground — a full-viewport FIXED layer that renders the immersive
 * "reinforcement-learning world" behind all page content.
 *
 * SSR / static-export safe: the r3f <Canvas> is loaded via next/dynamic with
 * { ssr: false } AND only mounted after the component is on the client, so the
 * WebGL context never touches the server render. A static dark gradient sits
 * behind the canvas as a fallback, so there is never a white flash and
 * low-power / reduced-motion devices still look correct.
 */

// Lazy Canvas wrapper — never rendered on the server.
const CanvasScene = dynamic(() => import("./rl-world/CanvasScene"), {
  ssr: false,
});

export function Scene3DBackground() {
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setMounted(true);

    // Skip WebGL entirely on very small / low-power viewports isn't required,
    // but bail if the browser has no WebGL support so we keep the gradient.
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) setEnabled(false);
    } catch {
      setEnabled(false);
    }
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
      style={{
        // Static dark fallback — always visible behind the canvas so there is
        // never a blank/white flash while the scene mounts.
        background:
          "radial-gradient(120% 90% at 50% 0%, #0b1210 0%, #070b0a 60%, #05080700 100%), linear-gradient(#0b1210, #070b0a)",
      }}
    >
      {mounted && enabled ? <CanvasScene /> : null}
    </div>
  );
}
