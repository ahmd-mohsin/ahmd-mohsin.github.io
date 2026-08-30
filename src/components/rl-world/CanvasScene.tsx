"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import RLWorld from "./RLWorld";

/**
 * CanvasScene — the r3f <Canvas> wrapper. Imported by Scene3DBackground via
 * next/dynamic({ ssr: false }) so the WebGL context is never created during
 * SSR / static export.
 *
 * Handles motion/perf policy:
 *  - prefers-reduced-motion  -> render a single still frame (frameloop "demand",
 *    animate=false): no camera drift, no agent motion, no ocean ripple.
 *  - document.hidden          -> pause the render loop (frameloop "never").
 *  - otherwise                -> frameloop "always" at 60fps.
 */
export default function CanvasScene() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMq = () => setReducedMotion(mq.matches);
    applyMq();
    mq.addEventListener("change", applyMq);

    const onVisibility = () => setVisible(!document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      mq.removeEventListener("change", applyMq);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const animate = !reducedMotion;
  const frameloop: "always" | "demand" | "never" = reducedMotion
    ? "demand"
    : visible
    ? "always"
    : "never";

  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 1.5]}
      camera={{ fov: 45, near: 0.1, far: 100, position: [0, 7.5, 15] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <RLWorld animate={animate} />
    </Canvas>
  );
}
