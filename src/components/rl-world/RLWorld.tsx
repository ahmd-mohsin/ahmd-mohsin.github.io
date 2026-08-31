"use client";

import { useMemo, useRef, useLayoutEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import * as THREE from "three";

/**
 * RLWorld — the r3f scene CONTENTS (everything inside <Canvas>).
 *
 * A calm, beautiful REINFORCEMENT-LEARNING gridworld that tells a LEARNING
 * story: box "agents" start with a noisy policy — they wander and BUMP into
 * walls (red flashes) taking long messy routes — and over successive EPISODES
 * their exploration decays until they trace the clean optimal path around the
 * walls to the glowing GOAL. The trail recolors red -> green as the agent
 * learns. Then a fresh agent starts learning again.
 *
 * `animate` (prefers-reduced-motion / tab visibility): when false, one still
 * frame — no motion, no pulsing.
 */

const CLEAR_COLOR = "#070b0a";
const CELL_COLOR = "#264a37";
const SECTION_COLOR = "#3a7052";
const GOAL_COLOR = "#ffd27a";
const WALL_COLOR = "#1b3627";
const WALL_RIM = "#4f976c";
const AGENT_BASE = new THREE.Color("#78e6a0");
const AGENT_BUMP = new THREE.Color("#ff6a4d");
const TRAIL_EARLY = new THREE.Color("#e0663c"); // messy / exploring
const TRAIL_LEARNED = new THREE.Color("#5fae7a"); // converged

const HALF = 7;
const GOAL: [number, number] = [4, -3];
const AGENT_COUNT = 3;
const EPISODES = 5;
const PAUSE = 3; // frames held at the goal between episodes
const GOLDEN_ANGLE = 2.399963229728653;

// A wall with a single gap, so agents must learn to route around it.
const WALLS: [number, number][] = [
  [1, -5], [1, -4], [1, -3], [1, -1], [1, 0], [1, 1], [1, 2],
];
const wallKey = (x: number, z: number) => `${x},${z}`;
const WALL_SET = new Set(WALLS.map(([x, z]) => wallKey(x, z)));
const inBounds = (x: number, z: number) =>
  x >= -HALF && x <= HALF && z >= -HALF && z <= HALF;
const passable = (x: number, z: number) => inBounds(x, z) && !WALL_SET.has(wallKey(x, z));

const DIRS: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function hash01(n: number): number {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

// BFS distance-to-goal over passable cells — defines the optimal policy.
const DIST: Map<string, number> = (() => {
  const d = new Map<string, number>();
  d.set(wallKey(GOAL[0], GOAL[1]), 0);
  let frontier: [number, number][] = [GOAL];
  while (frontier.length) {
    const next: [number, number][] = [];
    for (const [x, z] of frontier) {
      const base = d.get(wallKey(x, z))!;
      for (const [dx, dz] of DIRS) {
        const nx = x + dx, nz = z + dz;
        if (!passable(nx, nz)) continue;
        const k = wallKey(nx, nz);
        if (!d.has(k)) {
          d.set(k, base + 1);
          next.push([nx, nz]);
        }
      }
    }
    frontier = next;
  }
  return d;
})();

// Greedy optimal step: the passable neighbor with the smallest distance-to-goal.
function greedyStep(x: number, z: number): [number, number] {
  let best: [number, number] = [0, 0];
  let bestD = DIST.get(wallKey(x, z)) ?? Infinity;
  for (const [dx, dz] of DIRS) {
    const nx = x + dx, nz = z + dz;
    if (!passable(nx, nz)) continue;
    const nd = DIST.get(wallKey(nx, nz));
    if (nd !== undefined && nd < bestD) {
      bestD = nd;
      best = [dx, dz];
    }
  }
  return best;
}

type Frame = { cell: [number, number]; ep: number; bump: boolean; goal: boolean };

/** Precompute the full learning timeline for one agent: EPISODES rollouts from
 *  a start cell with exploration decaying to zero, flattened into unit-step
 *  frames. Deterministic (hashed), so it is stable and resumable. */
function buildTimeline(agentSeed: number, start: [number, number]): Frame[] {
  const frames: Frame[] = [];
  for (let e = 0; e < EPISODES; e++) {
    const epsilon = 0.62 * (1 - e / (EPISODES - 1)); // 0.62 -> 0
    let [cx, cz] = start;
    frames.push({ cell: [cx, cz], ep: e, bump: false, goal: false });
    let steps = 0;
    const maxSteps = 80;
    while (!(cx === GOAL[0] && cz === GOAL[1]) && steps < maxSteps) {
      const seed = agentSeed * 1e5 + e * 1e3 + steps;
      const explore = hash01(seed) < epsilon;
      let dir: [number, number];
      if (explore) {
        dir = DIRS[Math.floor(hash01(seed + 0.37) * 4) % 4];
      } else {
        dir = greedyStep(cx, cz);
      }
      const nx = cx + dir[0], nz = cz + dir[1];
      if (!passable(nx, nz)) {
        // bump: the agent tries an invalid move, stays put, and flashes.
        frames.push({ cell: [cx, cz], ep: e, bump: true, goal: false });
      } else {
        cx = nx; cz = nz;
        frames.push({ cell: [cx, cz], ep: e, bump: false, goal: cx === GOAL[0] && cz === GOAL[1] });
      }
      steps++;
    }
    // hold at the goal for a beat before the next episode
    for (let p = 0; p < PAUSE; p++)
      frames.push({ cell: [cx, cz], ep: e, bump: false, goal: true });
  }
  return frames;
}

/** The goal cell: a bright pulsing tile plus an expanding reward ring. */
function GoalMarker({ animate }: { animate: boolean }) {
  const tileRef = useRef<THREE.MeshBasicMaterial>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    const t = animate ? state.clock.elapsedTime : 0;
    if (tileRef.current)
      tileRef.current.opacity = 0.55 + 0.35 * (0.5 + 0.5 * Math.sin(t * 2.2));
    if (ringRef.current && ringMat.current) {
      const p = (t * 0.5) % 1;
      const s = 0.5 + p * 2.6;
      ringRef.current.scale.set(s, s, s);
      ringMat.current.opacity = animate ? (1 - p) * 0.5 : 0.3;
    }
  });

  return (
    <group position={[GOAL[0], 0, GOAL[1]]}>
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.96, 0.96]} />
        <meshBasicMaterial ref={tileRef} color={GOAL_COLOR} transparent opacity={0.7}
          blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={ringRef} position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.5, 40]} />
        <meshBasicMaterial ref={ringMat} color={GOAL_COLOR} transparent opacity={0.4}
          blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Walls the agents must learn to route around. */
function Walls() {
  const geom = useMemo(() => new THREE.BoxGeometry(0.88, 0.8, 0.88), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(geom), [geom]);
  return (
    <>
      {WALLS.map(([x, z], i) => (
        <group key={i} position={[x, 0.4, z]}>
          <mesh geometry={geom}>
            <meshStandardMaterial color={WALL_COLOR} emissive={WALL_RIM} emissiveIntensity={0.55}
              roughness={0.85} metalness={0.1} flatShading />
          </mesh>
          <lineSegments geometry={edges}>
            <lineBasicMaterial color={WALL_RIM} transparent opacity={0.8} toneMapped={false} />
          </lineSegments>
        </group>
      ))}
    </>
  );
}

/** A learning agent: a glowing box that rolls out episodes from messy to clean,
 *  flashing red on wall bumps, with a trail that recolors red -> green as it
 *  learns. */
function Agent({ index, animate }: { index: number; animate: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const boxMat = useRef<THREE.MeshStandardMaterial>(null);
  const trailRef = useRef<THREE.InstancedMesh>(null);
  const trailMat = useRef<THREE.MeshBasicMaterial>(null);
  const TRAIL = 12;

  const { frames, speed, phase } = useMemo(() => {
    const seed = index * 7 + 3;
    // deterministic start on the left side, away from the goal
    const sx = -HALF + Math.floor(hash01(seed) * 3); // -7..-5
    const sz = -HALF + 2 + Math.floor(hash01(seed + 1) * (HALF * 2 - 3));
    const start: [number, number] =
      passable(sx, sz) && DIST.has(wallKey(sx, sz)) ? [sx, sz] : [-HALF, HALF];
    return {
      frames: buildTimeline(seed, start),
      speed: 2.4 + hash01(seed + 2) * 0.8, // frames/sec
      phase: index * GOLDEN_ANGLE * 3,
    };
  }, [index]);

  const tmp = useMemo(() => new THREE.Object3D(), []);
  const col = useMemo(() => new THREE.Color(), []);

  const place = (time: number) => {
    const g = groupRef.current;
    if (!g) return;
    const n = frames.length;
    const prog = time * speed + phase;
    const i = ((Math.floor(prog) % n) + n) % n;
    const frac = prog - Math.floor(prog);
    const ease = frac * frac * (3 - 2 * frac);
    const a = frames[i];
    const b = frames[(i + 1) % n];
    // bump frames keep the same cell → the ease produces a tiny in-place nudge
    g.position.set(
      a.cell[0] + (b.cell[0] - a.cell[0]) * ease,
      0.42 + Math.sin(frac * Math.PI) * (a.bump ? 0.05 : 0.13),
      a.cell[1] + (b.cell[1] - a.cell[1]) * ease
    );

    // learning progress → trail color (red early episodes, green once learned)
    const learn = a.ep / (EPISODES - 1);
    if (trailMat.current)
      trailMat.current.color.copy(TRAIL_EARLY).lerp(TRAIL_LEARNED, learn);

    // bump → flash the box red
    if (boxMat.current) {
      const flash = a.bump ? Math.max(0, 1 - frac * 2) : 0;
      col.copy(AGENT_BASE).lerp(AGENT_BUMP, flash);
      boxMat.current.color.copy(col);
      boxMat.current.emissive.copy(col);
      boxMat.current.emissiveIntensity = 2.0 + flash * 2.5;
    }

    // trail: the last TRAIL cells behind the current step
    const tm = trailRef.current;
    if (tm) {
      for (let k = 0; k < TRAIL; k++) {
        const ci = i - 1 - k;
        const cell = frames[((ci % n) + n) % n].cell;
        const fade = 1 - k / TRAIL;
        const s = 0.7 * fade + 0.05;
        tmp.position.set(cell[0], 0.045, cell[1]);
        tmp.scale.set(s, s, s);
        tmp.rotation.set(-Math.PI / 2, 0, 0);
        tmp.updateMatrix();
        tm.setMatrixAt(k, tmp.matrix);
      }
      tm.instanceMatrix.needsUpdate = true;
    }
  };

  useLayoutEffect(() => { place(0); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useFrame((state) => place(animate ? state.clock.elapsedTime : 0));

  const trailGeom = useMemo(() => new THREE.PlaneGeometry(0.82, 0.82), []);

  return (
    <>
      <instancedMesh ref={trailRef} args={[trailGeom, undefined, TRAIL]}>
        <meshBasicMaterial ref={trailMat} color={TRAIL_EARLY} transparent opacity={0.24}
          blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </instancedMesh>

      <group ref={groupRef}>
        <mesh>
          <boxGeometry args={[0.44, 0.44, 0.44]} />
          <meshStandardMaterial ref={boxMat} color={AGENT_BASE} emissive={AGENT_BASE}
            emissiveIntensity={2.0} toneMapped={false} flatShading />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.44, 12, 12]} />
          <meshBasicMaterial color={AGENT_BASE} transparent opacity={0.1}
            blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>
    </>
  );
}

/** Slow automatic camera drift over the board, from a high isometric angle. */
function CameraRig({ animate }: { animate: boolean }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0, -1), []);

  useLayoutEffect(() => {
    camera.position.set(0, 9.5, 12);
    camera.lookAt(target);
  }, [camera, target]);

  useFrame((state) => {
    if (!animate) return;
    const t = state.clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.045) * 2.6;
    camera.position.y = 9.5 + Math.sin(t * 0.035) * 0.5;
    camera.position.z = 12 + Math.cos(t * 0.045) * 1.1;
    camera.lookAt(target);
  });

  return null;
}

export default function RLWorld({ animate = true }: { animate?: boolean }) {
  const agents = useMemo(() => Array.from({ length: AGENT_COUNT }, (_, i) => i), []);

  return (
    <>
      <color attach="background" args={[CLEAR_COLOR]} />
      <fog attach="fog" args={[CLEAR_COLOR, 22, 64]} />

      <ambientLight intensity={0.6} color="#9fbfa9" />
      <directionalLight position={[6, 12, 8]} intensity={0.7} color="#cfe6d6" />
      <pointLight position={[GOAL[0], 4, GOAL[1]]} intensity={9} distance={30} decay={2} color={GOAL_COLOR} />

      <CameraRig animate={animate} />

      <Grid
        args={[HALF * 2 + 4, HALF * 2 + 4]}
        cellSize={1}
        cellThickness={0.9}
        cellColor={CELL_COLOR}
        sectionSize={5}
        sectionThickness={1.4}
        sectionColor={SECTION_COLOR}
        fadeDistance={52}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={false}
        position={[0, 0, 0]}
      />

      <Walls />
      <GoalMarker animate={animate} />

      {agents.map((i) => (
        <Agent key={i} index={i} animate={animate} />
      ))}
    </>
  );
}
