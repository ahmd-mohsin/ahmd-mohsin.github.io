"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * RLWorld — the r3f scene CONTENTS (everything that goes inside <Canvas>).
 *
 * A stylized, calm "reinforcement-learning world": a dark near-black ocean at
 * night viewed from a high angle, a few low-poly islands, and a handful of
 * slow-patrolling glowing emerald "agent" dots. Deep fog dissolves distant
 * geometry into black. Very slow continuous camera drift for parallax.
 *
 * `animate` is driven by the parent (prefers-reduced-motion / tab visibility):
 * when false the scene renders a single still frame — no camera drift, no
 * agent motion, no ocean ripple.
 */

const CLEAR_COLOR = "#070b0a";
const OCEAN_COLOR = "#0b1512";
const OCEAN_EMISSIVE = "#0a1f16";
const LAND_COLOR = "#14241b";
const LAND_RIM = "#1c3326";
const TREE_COLOR = "#1c3326";
const AGENT_COLOR = "#5fae7a";

// Deterministic island layout — no Math.random() (unavailable). Positions,
// radii and heights are hand-picked so islands read as scattered across the
// ocean and recede toward the fogged horizon.
type Island = {
  position: [number, number, number];
  radius: number;
  height: number;
  trees: number;
};

const ISLANDS: Island[] = [
  { position: [-6.5, 0, 1.5], radius: 2.6, height: 0.6, trees: 5 },
  { position: [4.5, 0, 3.5], radius: 2.0, height: 0.5, trees: 4 },
  { position: [0.5, 0, -3.5], radius: 3.0, height: 0.7, trees: 6 },
  { position: [-9.0, 0, -6.0], radius: 1.8, height: 0.45, trees: 3 },
  { position: [8.5, 0, -5.5], radius: 2.2, height: 0.55, trees: 4 },
  { position: [-2.0, 0, 6.5], radius: 1.6, height: 0.4, trees: 3 },
];

const AGENT_COUNT = 8;
const GOLDEN_ANGLE = 2.399963229728653; // ~137.5deg, well-spread phases

// A deterministic pseudo-value in [0,1) from an integer seed — replaces
// Math.random() for stable per-agent/per-tree variation.
function hash01(n: number): number {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

/** Low-poly island: a squat cylinder landmass with a faint emerald rim and a
 *  small cluster of cone "trees". */
function IslandMesh({ island, seed }: { island: Island; seed: number }) {
  const trees = useMemo(() => {
    const out: { position: [number, number, number]; scale: number }[] = [];
    for (let i = 0; i < island.trees; i++) {
      const a = i * GOLDEN_ANGLE + seed;
      const r = island.radius * (0.15 + 0.6 * hash01(seed + i * 3.1));
      const scale = 0.7 + 0.7 * hash01(seed + i * 7.7);
      out.push({
        position: [Math.cos(a) * r, island.height, Math.sin(a) * r],
        scale,
      });
    }
    return out;
  }, [island, seed]);

  return (
    <group position={island.position}>
      {/* landmass */}
      <mesh position={[0, island.height / 2, 0]} castShadow={false} receiveShadow={false}>
        <cylinderGeometry args={[island.radius, island.radius * 1.15, island.height, 7]} />
        <meshStandardMaterial
          color={LAND_COLOR}
          emissive={LAND_RIM}
          emissiveIntensity={0.15}
          roughness={0.95}
          metalness={0.05}
          flatShading
        />
      </mesh>
      {/* trees */}
      {trees.map((t, i) => (
        <mesh key={i} position={t.position} scale={[t.scale, t.scale, t.scale]}>
          <coneGeometry args={[0.35, 1.1, 5]} />
          <meshStandardMaterial
            color={TREE_COLOR}
            emissive={AGENT_COLOR}
            emissiveIntensity={0.06}
            roughness={0.9}
            metalness={0.05}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}

/** A single glowing agent: a small emissive core sphere plus a larger additive
 *  halo sphere for a cheap bloom-like glow. Patrols a smooth looping path
 *  derived deterministically from its index. */
function Agent({ index, animate }: { index: number; animate: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  const params = useMemo(() => {
    const phase = index * GOLDEN_ANGLE;
    const cx = (hash01(index + 1) - 0.5) * 14;
    const cz = (hash01(index + 5) - 0.5) * 14;
    const rx = 1.5 + hash01(index + 9) * 4.5;
    const rz = 1.5 + hash01(index + 13) * 4.5;
    const speed = 0.06 + hash01(index + 17) * 0.09;
    const y = 0.55 + hash01(index + 21) * 0.35;
    return { phase, cx, cz, rx, rz, speed, y };
  }, [index]);

  // Place immediately so the still-frame (reduced motion) case looks right.
  const setPosition = (time: number) => {
    const g = groupRef.current;
    if (!g) return;
    const t = time * params.speed + params.phase;
    g.position.set(
      params.cx + Math.sin(t) * params.rx,
      params.y,
      params.cz + Math.cos(t * 0.8 + params.phase) * params.rz
    );
  };

  useFrame((state) => {
    if (!animate) return;
    setPosition(state.clock.elapsedTime);
  });

  // Static placement for the initial / reduced-motion frame.
  const initial = useMemo(() => {
    const t = params.phase;
    return [
      params.cx + Math.sin(t) * params.rx,
      params.y,
      params.cz + Math.cos(t * 0.8 + params.phase) * params.rz,
    ] as [number, number, number];
  }, [params]);

  return (
    <group ref={groupRef} position={initial}>
      {/* glowing core */}
      <mesh>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial
          color={AGENT_COLOR}
          emissive={AGENT_COLOR}
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </mesh>
      {/* soft additive halo */}
      <mesh>
        <sphereGeometry args={[0.34, 12, 12]} />
        <meshBasicMaterial
          color={AGENT_COLOR}
          transparent
          opacity={0.13}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/** Large dark ocean plane with a subtle, cheap time-based vertex ripple. */
function Ocean({ animate }: { animate: boolean }) {
  const geomRef = useRef<THREE.PlaneGeometry>(null);
  const base = useRef<Float32Array | null>(null);
  const frame = useRef(0);

  useFrame((state) => {
    if (!animate) return;
    const geom = geomRef.current;
    if (!geom) return;
    const pos = geom.attributes.position as THREE.BufferAttribute;
    if (!base.current) {
      base.current = Float32Array.from(pos.array as Float32Array);
    }
    const b = base.current;
    const t = state.clock.elapsedTime * 0.4;
    for (let i = 0; i < pos.count; i++) {
      const x = b[i * 3];
      const y = b[i * 3 + 1];
      const z =
        Math.sin(x * 0.35 + t) * 0.12 + Math.cos(y * 0.4 + t * 0.8) * 0.12;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    // Recompute normals only every few frames — the ripple is slow and this is
    // the scene's biggest per-frame cost.
    if (frame.current++ % 6 === 0) geom.computeVertexNormals();
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
      <planeGeometry ref={geomRef} args={[120, 120, 24, 24]} />
      <meshStandardMaterial
        color={OCEAN_COLOR}
        emissive={OCEAN_EMISSIVE}
        emissiveIntensity={0.25}
        roughness={0.35}
        metalness={0.5}
      />
    </mesh>
  );
}

/** Slow automatic camera drift (gentle orbital sway) — no user controls. */
function CameraRig({ animate }: { animate: boolean }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0, -1), []);

  // Establish a high angle looking across the ocean toward the fogged horizon.
  useMemo(() => {
    camera.position.set(0, 7.5, 15);
    camera.lookAt(target);
  }, [camera, target]);

  useFrame((state) => {
    if (!animate) return;
    const t = state.clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.05) * 2.2;
    camera.position.y = 7.5 + Math.sin(t * 0.04) * 0.6;
    camera.position.z = 15 + Math.cos(t * 0.05) * 1.2;
    camera.lookAt(target);
  });

  return null;
}

export default function RLWorld({ animate = true }: { animate?: boolean }) {
  const agents = useMemo(
    () => Array.from({ length: AGENT_COUNT }, (_, i) => i),
    []
  );

  return (
    <>
      {/* clear color + deep fog so distant geometry dissolves into black */}
      <color attach="background" args={[CLEAR_COLOR]} />
      <fog attach="fog" args={[CLEAR_COLOR, 14, 42]} />

      {/* lighting: low ambient, one dim directional, faint emerald point light */}
      <ambientLight intensity={0.25} color="#8aa090" />
      <directionalLight position={[6, 12, 8]} intensity={0.5} color="#cfe6d6" />
      <pointLight position={[0, 4, 0]} intensity={7} distance={30} decay={2} color={AGENT_COLOR} />

      <CameraRig animate={animate} />
      <Ocean animate={animate} />

      {ISLANDS.map((island, i) => (
        <IslandMesh key={i} island={island} seed={i * 4 + 1} />
      ))}

      {agents.map((i) => (
        <Agent key={i} index={i} animate={animate} />
      ))}
    </>
  );
}
