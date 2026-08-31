"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GOAL } from "./maze";

/**
 * FlagAndGoal — the reward marker the RL agent is learning to reach.
 *
 * Renders a slender flag (muted metal pole + waving gold banner) at GOAL, over
 * a pulsing reward glow: an additive gold floor tile, an expanding/fading ring,
 * and a soft radial ground disc. Reads as "reward reached" without being busy.
 *
 * When `animate` is false, it holds a calm still frame (no waving, no pulsing).
 * Mounted inside an existing <Canvas> — this component never creates one.
 */

const GOLD = "#ffd27a";
const METAL = "#8aa090";

// Still-frame constants (used when animate === false, and as sane initial values).
const STILL_RING_SCALE = 1.55;
const STILL_RING_OPACITY = 0.32;
const STILL_TILE_OPACITY = 0.4;
const STILL_GLOW_OPACITY = 0.12;

const RING_PERIOD = 2.4; // seconds for one expand-and-fade cycle

export default function FlagAndGoal({ animate = true }: { animate?: boolean }) {
  const flagPivot = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const tileMat = useRef<THREE.MeshBasicMaterial>(null);
  const glowMat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    if (!animate) return;
    const t = clock.elapsedTime;

    // Gentle banner wave: subtle yaw + slight horizontal stretch.
    if (flagPivot.current) {
      flagPivot.current.rotation.y = Math.sin(t * 1.8) * 0.22;
      flagPivot.current.scale.x = 1 + Math.sin(t * 3.2) * 0.07;
    }

    // Expanding, fading reward ring on a loop.
    const phase = (t % RING_PERIOD) / RING_PERIOD; // 0..1
    if (ring.current) ring.current.scale.setScalar(0.6 + phase * 2.4);
    if (ringMat.current) ringMat.current.opacity = (1 - phase) * 0.55;

    // Pulsing reward tile + soft ground glow.
    if (tileMat.current) tileMat.current.opacity = 0.32 + Math.sin(t * 2) * 0.14;
    if (glowMat.current) glowMat.current.opacity = 0.1 + Math.sin(t * 1.3) * 0.04;
  });

  return (
    <group position={[GOAL[0], 0, GOAL[1]]}>
      {/* --- flag pole --- */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.035, 1.5, 12]} />
        <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.35} />
      </mesh>
      {/* small finial at the top of the pole */}
      <mesh position={[0, 1.52, 0]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={1.4}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* --- waving gold banner --- */}
      {/* pivot sits at the pole so yaw/stretch read as a flag catching wind */}
      <group ref={flagPivot} position={[0, 1.3, 0]}>
        <mesh position={[0.3, 0, 0]}>
          <planeGeometry args={[0.6, 0.4, 1, 1]} />
          <meshStandardMaterial
            color={GOLD}
            emissive={GOLD}
            emissiveIntensity={1.8}
            side={THREE.DoubleSide}
            roughness={0.5}
            metalness={0.1}
          />
        </mesh>
      </group>

      {/* --- reward tile flat on the grid --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[0.96, 0.96]} />
        <meshBasicMaterial
          ref={tileMat}
          color={GOLD}
          transparent
          opacity={STILL_TILE_OPACITY}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* --- expanding reward ring --- */}
      <mesh
        ref={ring}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.045, 0]}
        scale={STILL_RING_SCALE}
      >
        <ringGeometry args={[0.42, 0.5, 48]} />
        <meshBasicMaterial
          ref={ringMat}
          color={GOLD}
          transparent
          opacity={STILL_RING_OPACITY}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* --- soft radial ground glow --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[1.3, 48]} />
        <meshBasicMaterial
          ref={glowMat}
          color={GOLD}
          transparent
          opacity={STILL_GLOW_OPACITY}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
