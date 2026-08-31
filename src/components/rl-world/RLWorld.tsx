"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Grid, Line } from "@react-three/drei";
import * as THREE from "three";

/**
 * RLWorld — the r3f scene CONTENTS (everything inside <Canvas>).
 *
 * A calm, legible REINFORCEMENT-LEARNING gridworld: a dark tilted grid floor
 * (the environment), a handful of glowing emerald "agents" that step cell-by-
 * cell along their trajectories toward pulsing GOAL tiles (rewards), with the
 * faint route each agent follows drawn as a policy path. Slow camera drift.
 *
 * `animate` (driven by prefers-reduced-motion / tab visibility): when false the
 * scene renders a single still frame — no agent motion, no camera drift, no
 * goal pulsing.
 */

const CLEAR_COLOR = "#070b0a";
const CELL_COLOR = "#1d3a2b";
const SECTION_COLOR = "#2f5a41";
const AGENT_COLOR = "#5fae7a";
const GOAL_COLOR = "#8fe0a8";
const PATH_COLOR = "#3f7a56";

const HALF = 7; // grid runs from -HALF..HALF cells in x and z
const AGENT_COUNT = 5;
const GOLDEN_ANGLE = 2.399963229728653;

// Deterministic pseudo-value in [0,1) from a seed — no Math.random (unavailable).
function hash01(n: number): number {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

type Cell = [number, number]; // [x, z] integer grid coordinates

/** Build a looping trajectory for an agent: 4 deterministic waypoints connected
 *  by Manhattan (grid-aligned) unit steps, so it reads as an agent traversing
 *  cells of a gridworld. Returns the expanded per-cell path and the waypoints
 *  (used as goal markers). */
function buildTrajectory(seed: number): { cells: Cell[]; goals: Cell[] } {
  const goals: Cell[] = [];
  for (let k = 0; k < 4; k++) {
    const x = Math.round((hash01(seed * 3.1 + k * 2.7) - 0.5) * (HALF * 2));
    const z = Math.round((hash01(seed * 5.7 + k * 4.3) - 0.5) * (HALF * 2));
    goals.push([x, z]);
  }

  const cells: Cell[] = [];
  const push = (c: Cell) => {
    const last = cells[cells.length - 1];
    if (!last || last[0] !== c[0] || last[1] !== c[1]) cells.push(c);
  };
  for (let i = 0; i < goals.length; i++) {
    const a = goals[i];
    const b = goals[(i + 1) % goals.length];
    let [x, z] = a;
    push([x, z]);
    while (x !== b[0]) {
      x += x < b[0] ? 1 : -1;
      push([x, z]);
    }
    while (z !== b[1]) {
      z += z < b[1] ? 1 : -1;
      push([x, z]);
    }
  }
  if (cells.length < 2) cells.push([goals[0][0] + 1, goals[0][1]]);
  return { cells, goals };
}

/** A pulsing goal (reward) tile lying flat on a grid cell. */
function Goal({ cell, phase, animate }: { cell: Cell; phase: number; animate: boolean }) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((state) => {
    if (!matRef.current) return;
    const t = animate ? state.clock.elapsedTime : 0;
    matRef.current.opacity = 0.22 + 0.16 * (0.5 + 0.5 * Math.sin(t * 1.8 + phase));
  });
  return (
    <mesh position={[cell[0], 0.02, cell[1]]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.92, 0.92]} />
      <meshBasicMaterial
        ref={matRef}
        color={GOAL_COLOR}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/** A single agent: a glowing emerald cube that hops cell-to-cell along its
 *  trajectory (with a subtle vertical hop per step), its route drawn faintly
 *  beneath it, and its goals marked. */
function Agent({ index, animate }: { index: number; animate: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  const { cells, goals, speed, phase } = useMemo(() => {
    const seed = index * 4 + 1;
    const traj = buildTrajectory(seed);
    return {
      ...traj,
      speed: 0.7 + hash01(seed + 2) * 0.5, // cells per second
      phase: index * GOLDEN_ANGLE,
    };
  }, [index]);

  const routePoints = useMemo(
    () => cells.map((c) => [c[0], 0.03, c[1]] as [number, number, number]),
    [cells]
  );

  const place = (time: number) => {
    const g = groupRef.current;
    if (!g) return;
    const n = cells.length;
    const prog = time * speed;
    const i = Math.floor(prog) % n;
    const frac = prog - Math.floor(prog);
    const ease = frac * frac * (3 - 2 * frac); // smoothstep
    const a = cells[i];
    const b = cells[(i + 1) % n];
    g.position.x = a[0] + (b[0] - a[0]) * ease;
    g.position.z = a[1] + (b[1] - a[1]) * ease;
    g.position.y = 0.38 + Math.sin(frac * Math.PI) * 0.14; // hop
  };

  // Deterministic initial placement so the still frame looks right.
  useMemo(() => place(phase * 0.0), []); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((state) => {
    place(animate ? state.clock.elapsedTime : 0);
  });

  return (
    <>
      {/* faint policy route */}
      <Line points={routePoints} color={PATH_COLOR} lineWidth={1} transparent opacity={0.35} />
      {/* goals / rewards */}
      {goals.map((c, i) => (
        <Goal key={i} cell={c} phase={phase + i * 1.3} animate={animate} />
      ))}
      {/* the agent */}
      <group ref={groupRef} position={[cells[0][0], 0.38, cells[0][1]]}>
        <mesh>
          <boxGeometry args={[0.42, 0.42, 0.42]} />
          <meshStandardMaterial
            color={AGENT_COLOR}
            emissive={AGENT_COLOR}
            emissiveIntensity={2.4}
            toneMapped={false}
          />
        </mesh>
        {/* soft additive halo */}
        <mesh>
          <sphereGeometry args={[0.5, 12, 12]} />
          <meshBasicMaterial
            color={AGENT_COLOR}
            transparent
            opacity={0.16}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </>
  );
}

/** Slow automatic camera drift over the gridworld, from a high isometric-ish
 *  angle so the grid and agents read clearly. */
function CameraRig({ animate }: { animate: boolean }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useMemo(() => {
    camera.position.set(0, 9, 12);
    camera.lookAt(target);
  }, [camera, target]);

  useFrame((state) => {
    if (!animate) return;
    const t = state.clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.05) * 2.4;
    camera.position.y = 9 + Math.sin(t * 0.04) * 0.5;
    camera.position.z = 12 + Math.cos(t * 0.05) * 1.0;
    camera.lookAt(target);
  });

  return null;
}

export default function RLWorld({ animate = true }: { animate?: boolean }) {
  const agents = useMemo(() => Array.from({ length: AGENT_COUNT }, (_, i) => i), []);

  return (
    <>
      <color attach="background" args={[CLEAR_COLOR]} />
      <fog attach="fog" args={[CLEAR_COLOR, 20, 60]} />

      {/* lighting */}
      <ambientLight intensity={0.6} color="#9fbfa9" />
      <directionalLight position={[6, 12, 8]} intensity={0.7} color="#cfe6d6" />
      <pointLight position={[0, 5, 0]} intensity={8} distance={34} decay={2} color={AGENT_COLOR} />

      <CameraRig animate={animate} />

      {/* the gridworld floor */}
      <Grid
        args={[HALF * 2 + 6, HALF * 2 + 6]}
        cellSize={1}
        cellThickness={0.6}
        cellColor={CELL_COLOR}
        sectionSize={5}
        sectionThickness={1}
        sectionColor={SECTION_COLOR}
        fadeDistance={48}
        fadeStrength={1.2}
        followCamera={false}
        infiniteGrid={false}
        position={[0, 0, 0]}
      />

      {agents.map((i) => (
        <Agent key={i} index={i} animate={animate} />
      ))}
    </>
  );
}
