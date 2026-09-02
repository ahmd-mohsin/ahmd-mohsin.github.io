"use client";

import { useMemo, useRef, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WALL_SEGMENTS } from "./maze";

/**
 * Walls3D — the maze walls, drawn as thin tall panels from WALL_SEGMENTS.
 *
 * Every wall segment becomes one instance of a shared unit box that is scaled
 * per-instance into a thin, tall panel: for axis 'x' the panel runs along Z
 * (thin in X); for axis 'z' it runs along X (thin in Z). Two instanced meshes
 * keep the whole maze at two draw calls: a matte dark-emerald BODY with an
 * emissive rim, plus a subtly brighter lit CAP strip along the top edge.
 *
 * Matrices are written once in useLayoutEffect via a reused Object3D. When
 * `animate` is false the walls are perfectly still; when true the top caps get
 * a very slight, slow emissive breathing so the edges read as lit — calm, not
 * neon.
 */

const BODY_COLOR = "#22121b";
const BODY_RIM = "#a85f80";
const CAP_COLOR = "#ffb3d6";

const LENGTH = 1.02; // run of a panel along its long axis
const THICKNESS = 0.12; // panel thickness (short axis)
const HEIGHT = 0.62; // wall height
const CAP_HEIGHT = 0.05; // thin lit strip on top

export default function Walls3D({ animate = true }: { animate?: boolean }) {
  const bodyRef = useRef<THREE.InstancedMesh>(null);
  const capRef = useRef<THREE.InstancedMesh>(null);
  const capMat = useRef<THREE.MeshStandardMaterial>(null);

  const count = WALL_SEGMENTS.length;

  // Shared geometry — a unit box scaled per instance into a wall panel.
  const bodyGeom = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const capGeom = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

  useLayoutEffect(() => {
    const body = bodyRef.current;
    const cap = capRef.current;
    if (!body || !cap) return;
    const d = new THREE.Object3D();

    WALL_SEGMENTS.forEach((seg, i) => {
      // axis 'x' => runs along Z (thin in X); axis 'z' => runs along X (thin in Z)
      const sx = seg.axis === "x" ? THICKNESS : LENGTH;
      const sz = seg.axis === "x" ? LENGTH : THICKNESS;

      // body
      d.position.set(seg.x, HEIGHT / 2, seg.z);
      d.scale.set(sx, HEIGHT, sz);
      d.rotation.set(0, 0, 0);
      d.updateMatrix();
      body.setMatrixAt(i, d.matrix);

      // top cap: same footprint, thin height, resting on the wall top
      d.position.set(seg.x, HEIGHT + CAP_HEIGHT / 2, seg.z);
      d.scale.set(sx, CAP_HEIGHT, sz);
      d.updateMatrix();
      cap.setMatrixAt(i, d.matrix);
    });

    body.instanceMatrix.needsUpdate = true;
    cap.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((state) => {
    if (!capMat.current) return;
    const t = animate ? state.clock.elapsedTime : 0;
    // subtle, slow breathing on the lit edge — calm, never neon
    capMat.current.emissiveIntensity = 1.05 + (animate ? 0.2 * Math.sin(t * 0.6) : 0);
  });

  return (
    <>
      <instancedMesh ref={bodyRef} args={[bodyGeom, undefined, count]} castShadow receiveShadow>
        <meshStandardMaterial
          color={BODY_COLOR}
          emissive={BODY_RIM}
          emissiveIntensity={0.45}
          roughness={0.9}
          metalness={0.08}
          flatShading
        />
      </instancedMesh>
      <instancedMesh ref={capRef} args={[capGeom, undefined, count]}>
        <meshStandardMaterial
          ref={capMat}
          color={CAP_COLOR}
          emissive={CAP_COLOR}
          emissiveIntensity={1.05}
          roughness={0.6}
          metalness={0.1}
          flatShading
          toneMapped={false}
        />
      </instancedMesh>
    </>
  );
}
