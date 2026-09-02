"use client";

import { useMemo, useRef, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  DIRS,
  EPISODES,
  START,
  passable,
  rolloutTimeline,
  hash01,
  type Cell,
  type Dir,
  type Frame,
} from "./maze";

/**
 * Agents — the LEARNING BOX AGENTS whose steps are drawn as ARROWS.
 *
 * Two glowing box agents roll out their `rolloutTimeline` from `maze.ts`: they
 * wander and BUMP into walls (red flashes) early, and over successive EPISODES
 * their exploration decays until they trace the clean path to the flag. Each
 * recently-visited cell drops a flat directional ARROW pointing in that step's
 * direction — the trail fades with age and recolors from RED (early / mistakes)
 * to GREEN (learned), so "the steps the box takes to learn" are literally
 * visible on the grid.
 *
 * `animate` false => a single still frame (no motion, no pulsing).
 */

const AGENT_BASE = new THREE.Color("#ffb3d6");
const AGENT_BUMP = new THREE.Color("#ff2d2d");
const ARROW_EARLY = new THREE.Color("#e12626"); // exploring / mistakes = red
const ARROW_LEARNED = new THREE.Color("#f48fb1"); // converged path = green
const ARROW_BUMP = new THREE.Color("#ff2d2d"); // attempted walled move = red

const TRAIL = 14; // number of recent step-arrows shown
const AGENT_COUNT = 2;
const BASE_FPS = 3.0; // frames (steps) per second
const GOLDEN_ANGLE = 2.399963229728653;
const AGENT_Y = 0.42;
const ARROW_Y = 0.05;

/** A flat arrow (shaft + head) lying in the XZ plane, pointing +X by default.
 *  Rotating it about Y by atan2(-dir.z, dir.x) aims it along a step direction. */
function makeArrowGeometry(): THREE.BufferGeometry {
  // vertices as (x, z) pairs in the ground plane, tip toward +X
  const tris: [number, number][][] = [
    // shaft (two triangles forming a rectangle)
    [[-0.34, -0.1], [0.05, -0.1], [0.05, 0.1]],
    [[-0.34, -0.1], [0.05, 0.1], [-0.34, 0.1]],
    // arrow head
    [[0.05, -0.26], [0.46, 0.0], [0.05, 0.26]],
  ];
  const pos: number[] = [];
  for (const t of tris)
    for (const [x, z] of t) pos.push(x, 0, z);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

/** Starts: START plus one adjacent open neighbor (fallback: START again). */
function pickStarts(): Cell[] {
  const starts: Cell[] = [[START[0], START[1]]];
  for (const [dx, dz] of DIRS) {
    const nb: Cell = [START[0] + dx, START[1] + dz];
    if (passable(START, nb)) {
      starts.push(nb);
      break;
    }
  }
  if (starts.length < AGENT_COUNT) starts.push([START[0], START[1]]);
  return starts;
}

function arrowAngle(dir: Dir): number {
  return Math.atan2(-dir[1], dir[0]);
}

/** One learning agent: a glowing box + its instanced arrow trail. */
function AgentUnit({
  index,
  start,
  animate,
}: {
  index: number;
  start: Cell;
  animate: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const boxMat = useRef<THREE.MeshStandardMaterial>(null);
  const arrowsRef = useRef<THREE.InstancedMesh>(null);

  const { frames, speed, phase } = useMemo(() => {
    const seed = index * 7 + 3;
    return {
      frames: rolloutTimeline(seed, start),
      speed: BASE_FPS + hash01(seed + 2) * 0.5,
      phase: index * GOLDEN_ANGLE * 5,
    };
  }, [index, start]);

  const arrowGeom = useMemo(() => makeArrowGeometry(), []);
  const tmp = useMemo(() => new THREE.Object3D(), []);
  const col = useMemo(() => new THREE.Color(), []);

  const place = (time: number) => {
    const n = frames.length;
    if (n === 0) return;
    const prog = time * speed + phase;
    const i = ((Math.floor(prog) % n) + n) % n;
    const frac = prog - Math.floor(prog);
    const ease = frac * frac * (3 - 2 * frac); // smoothstep

    const a: Frame = frames[i];
    const b: Frame = frames[(i + 1) % n];

    // --- move the box between cell centers, with a small hop ---
    const g = groupRef.current;
    if (g) {
      const hop = Math.sin(frac * Math.PI) * (a.bump ? 0.05 : 0.13);
      g.position.set(
        a.cell[0] + (b.cell[0] - a.cell[0]) * ease,
        AGENT_Y + hop,
        a.cell[1] + (b.cell[1] - a.cell[1]) * ease
      );
    }

    // --- box color: emerald, flashing red for the first half of a bump step ---
    if (boxMat.current) {
      const flash = a.bump ? Math.max(0, 1 - frac * 2) : 0;
      col.copy(AGENT_BASE).lerp(AGENT_BUMP, flash);
      boxMat.current.color.copy(col);
      boxMat.current.emissive.copy(col);
      boxMat.current.emissiveIntensity = 2.0 + flash * 2.5;
    }

    // --- the arrow trail: last TRAIL steps, fading with age, red -> green ---
    const arrows = arrowsRef.current;
    if (arrows) {
      for (let k = 0; k < TRAIL; k++) {
        const ci = ((i - 1 - k) % n + n) % n;
        const f: Frame = frames[ci];
        const fade = 1 - k / TRAIL;
        const hasDir = f.dir[0] !== 0 || f.dir[1] !== 0;

        if (!hasDir) {
          // start / pause frames carry no direction — hide the arrow
          tmp.position.set(0, ARROW_Y, 0);
          tmp.rotation.set(0, 0, 0);
          tmp.scale.setScalar(0);
        } else {
          const s = 0.72 * fade + 0.08;
          tmp.position.set(f.cell[0], ARROW_Y, f.cell[1]);
          tmp.rotation.set(0, arrowAngle(f.dir), 0);
          tmp.scale.setScalar(s);
        }
        tmp.updateMatrix();
        arrows.setMatrixAt(k, tmp.matrix);

        // color: red on bumps (mistakes), else lerp red->green by learning
        const learn = f.ep / (EPISODES - 1);
        if (f.bump) col.copy(ARROW_BUMP);
        else col.copy(ARROW_EARLY).lerp(ARROW_LEARNED, learn);
        // bake age fade into the (additive) color so older arrows glow fainter
        col.multiplyScalar(hasDir ? fade * 0.85 + 0.15 : 0);
        arrows.setColorAt(k, col);
      }
      arrows.instanceMatrix.needsUpdate = true;
      if (arrows.instanceColor) arrows.instanceColor.needsUpdate = true;
    }
  };

  // still frame before first useFrame tick (and when animate is false)
  useLayoutEffect(() => {
    place(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frames]);

  useFrame((state) => place(animate ? state.clock.elapsedTime : 0));

  return (
    <>
      <instancedMesh ref={arrowsRef} args={[arrowGeom, undefined, TRAIL]}>
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </instancedMesh>

      <group ref={groupRef}>
        <mesh>
          <boxGeometry args={[0.44, 0.44, 0.44]} />
          <meshStandardMaterial
            ref={boxMat}
            color={AGENT_BASE}
            emissive={AGENT_BASE}
            emissiveIntensity={2.0}
            toneMapped={false}
            flatShading
          />
        </mesh>
        {/* faint additive halo */}
        <mesh>
          <sphereGeometry args={[0.46, 12, 12]} />
          <meshBasicMaterial
            color={AGENT_BASE}
            transparent
            opacity={0.1}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </>
  );
}

export default function Agents({ animate = true }: { animate?: boolean }) {
  const starts = useMemo(() => pickStarts(), []);
  const agents = useMemo(
    () => Array.from({ length: AGENT_COUNT }, (_, i) => i),
    []
  );
  return (
    <>
      {agents.map((i) => (
        <AgentUnit
          key={i}
          index={i}
          start={starts[i] ?? starts[0]}
          animate={animate}
        />
      ))}
    </>
  );
}
