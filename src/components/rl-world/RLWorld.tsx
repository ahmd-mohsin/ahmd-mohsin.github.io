"use client";

import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import * as THREE from "three";
import { M, GOAL } from "./maze";
import Walls3D from "./Walls3D";
import Agents from "./Agents";
import FlagAndGoal from "./FlagAndGoal";

/**
 * RLWorld — the r3f scene CONTENTS (everything inside <Canvas>).
 *
 * A calm, beautiful REINFORCEMENT-LEARNING MAZE: a real 3D gridworld walled into
 * winding corridors (Walls3D) with a FLAG planted at the goal (FlagAndGoal). Box
 * "agents" learn to reach it (Agents): they wander and BUMP into walls (red
 * flashes) early, then over successive EPISODES their exploration decays until
 * they trace the clean path — the step arrows recolor red -> green as they learn.
 *
 * `animate` (prefers-reduced-motion / tab visibility): when false, one still
 * frame — no motion, no pulsing. It is threaded through to every child.
 *
 * SSR-safe: no window/document access at module scope. This file is only mounted
 * client-side via CanvasScene's ssr:false dynamic import.
 */

const CLEAR_COLOR = "#070b0a";
const AMBIENT_COLOR = "#9fbfa9";
const DIR_COLOR = "#cfe6d6";
const GOAL_COLOR = "#ffd27a";
const CELL_COLOR = "#264a37";
const SECTION_COLOR = "#3a7052";

/** Slow automatic camera drift over the maze, from a high angle. No user controls. */
function CameraRig({ animate }: { animate: boolean }) {
  const camera = useThree((s) => s.camera);
  const target = useMemo(() => new THREE.Vector3(0, 0, -0.5), []);

  useFrame((state) => {
    const t = animate ? state.clock.elapsedTime : 0;
    // very slow sway; when animate is false this collapses to the base pose
    camera.position.set(
      Math.sin(t * 0.045) * 2.4,
      11 + Math.sin(t * 0.035) * 0.5,
      11 + Math.cos(t * 0.045) * 1.0
    );
    camera.lookAt(target);
  });

  return null;
}

export default function RLWorld({ animate = true }: { animate?: boolean }) {
  return (
    <>
      <color attach="background" args={[CLEAR_COLOR]} />
      <fog attach="fog" args={[CLEAR_COLOR, 24, 66]} />

      <ambientLight intensity={0.6} color={AMBIENT_COLOR} />
      <directionalLight position={[6, 12, 8]} intensity={0.7} color={DIR_COLOR} />
      <pointLight
        position={[GOAL[0], 4, GOAL[1]]}
        intensity={9}
        distance={30}
        decay={2}
        color={GOAL_COLOR}
      />

      <CameraRig animate={animate} />

      <Grid
        args={[M + 3, M + 3]}
        cellSize={1}
        cellThickness={0.9}
        cellColor={CELL_COLOR}
        sectionSize={5}
        sectionThickness={1.4}
        sectionColor={SECTION_COLOR}
        fadeDistance={54}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={false}
        position={[0, 0, 0]}
      />

      <Walls3D animate={animate} />
      <Agents animate={animate} />
      <FlagAndGoal animate={animate} />
    </>
  );
}
