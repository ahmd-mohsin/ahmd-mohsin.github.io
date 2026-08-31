"use client";

import { useMemo, useRef, useLayoutEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import * as THREE from "three";

/**
 * RLWorld — the r3f scene CONTENTS (everything inside <Canvas>).
 *
 * A calm, beautiful, and legible REINFORCEMENT-LEARNING gridworld:
 *   - a glowing grid floor (the environment / state space)
 *   - a POLICY ARROW FIELD: every cell holds a small arrow pointing the optimal
 *     action toward the goal, brightening as it nears the goal (a value gradient)
 *   - a bright pulsing GOAL cell with an expanding reward ring
 *   - a few glowing AGENTS that roll out the policy step-by-step to the goal,
 *     then restart a new episode
 *
 * `animate` (prefers-reduced-motion / tab visibility): when false, one still
 * frame — no motion, no pulsing.
 */

const CLEAR_COLOR = "#070b0a";
const CELL_COLOR = "#274d39";
const SECTION_COLOR = "#3f7d5a";
const AGENT_COLOR = "#78e6a0";
const GOAL_COLOR = "#ffd27a";
const ARROW_DIM = new THREE.Color("#183327");
const ARROW_BRIGHT = new THREE.Color("#5fae7a");

const HALF = 7; // cells span -HALF..HALF in x and z
const GOAL: [number, number] = [3, -2];
const AGENT_COUNT = 4;
const GOLDEN_ANGLE = 2.399963229728653;

function hash01(n: number): number {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

// Optimal gridworld policy: the greedy cardinal step from (x,z) toward the goal.
function policyStep(x: number, z: number): [number, number] {
  const dx = GOAL[0] - x;
  const dz = GOAL[1] - z;
  if (dx === 0 && dz === 0) return [0, 0];
  if (Math.abs(dx) >= Math.abs(dz)) return [Math.sign(dx), 0];
  return [0, Math.sign(dz)];
}

/** All grid cells and the cell -> world helpers. */
const CELLS: [number, number][] = (() => {
  const out: [number, number][] = [];
  for (let x = -HALF; x <= HALF; x++)
    for (let z = -HALF; z <= HALF; z++) out.push([x, z]);
  return out;
})();

const MAX_DIST = HALF * 2 + Math.abs(GOAL[0]) + Math.abs(GOAL[1]);

/** Instanced policy-arrow field — one draw call for the whole board. Arrows are
 *  flat triangles lying on the grid, aimed along the optimal action, and colored
 *  from dim (far) to bright emerald (near goal): a value gradient. */
function PolicyField() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    // triangle pointing +X, lying flat in the XZ plane
    const verts = new Float32Array([
      0.34, 0, 0, -0.2, 0, 0.16, -0.2, 0, -0.16,
    ]);
    g.setAttribute("position", new THREE.BufferAttribute(verts, 3));
    g.computeVertexNormals();
    return g;
  }, []);

  const cells = useMemo(
    () => CELLS.filter(([x, z]) => !(x === GOAL[0] && z === GOAL[1])),
    []
  );

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    cells.forEach(([x, z], i) => {
      const [dx, dz] = policyStep(x, z);
      const angle = Math.atan2(-dz, dx); // rotate +X -> (dx,dz)
      dummy.position.set(x, 0.06, z);
      dummy.rotation.set(0, angle, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      const dist = Math.abs(GOAL[0] - x) + Math.abs(GOAL[1] - z);
      const t = 1 - dist / MAX_DIST; // 1 near goal, 0 far
      color.copy(ARROW_DIM).lerp(ARROW_BRIGHT, t * t);
      mesh.setColorAt(i, color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [cells]);

  return (
    <instancedMesh ref={meshRef} args={[geom, undefined, cells.length]}>
      <meshBasicMaterial
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
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
      const p = (t * 0.5) % 1; // 0..1 expanding pulse
      const s = 0.5 + p * 2.6;
      ringRef.current.scale.set(s, s, s);
      ringMat.current.opacity = animate ? (1 - p) * 0.5 : 0.3;
    }
  });

  return (
    <group position={[GOAL[0], 0, GOAL[1]]}>
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.96, 0.96]} />
        <meshBasicMaterial
          ref={tileRef}
          color={GOAL_COLOR}
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={ringRef} position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.5, 40]} />
        <meshBasicMaterial
          ref={ringMat}
          color={GOAL_COLOR}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/** An agent that rolls out the policy from a start cell to the goal, leaving a
 *  fading trail, then restarts a fresh episode. */
function Agent({ index, animate }: { index: number; animate: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.InstancedMesh>(null);
  const TRAIL = 7;

  const { path, speed } = useMemo(() => {
    const seed = index * 4 + 1;
    // deterministic start cell on the board
    const sx = Math.round((hash01(seed * 1.7) - 0.5) * (HALF * 2));
    const sz = Math.round((hash01(seed * 2.9) - 0.5) * (HALF * 2));
    const cells: [number, number][] = [[sx, sz]];
    let [cx, cz] = [sx, sz];
    let guard = 0;
    while (!(cx === GOAL[0] && cz === GOAL[1]) && guard < 200) {
      const [dx, dz] = policyStep(cx, cz);
      cx += dx;
      cz += dz;
      cells.push([cx, cz]);
      guard++;
    }
    return { path: cells, speed: 1.1 + hash01(seed + 3) * 0.5 };
  }, [index]);

  const phase = index * GOLDEN_ANGLE;

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const place = (time: number) => {
    const g = groupRef.current;
    if (!g) return;
    const n = path.length;
    const cyclePeriod = n + 2; // brief hold at the goal, then new episode
    const prog = (time * speed + phase) % cyclePeriod;
    const i = Math.min(Math.floor(prog), n - 1);
    const frac = Math.min(prog - Math.floor(prog), 1);
    const ease = frac * frac * (3 - 2 * frac);
    const a = path[i];
    const b = path[Math.min(i + 1, n - 1)];
    const px = a[0] + (b[0] - a[0]) * ease;
    const pz = a[1] + (b[1] - a[1]) * ease;
    g.position.set(px, 0.42 + Math.sin(frac * Math.PI) * 0.12, pz);

    // trail: the last TRAIL cells behind the current index
    const tm = trailRef.current;
    if (tm) {
      for (let k = 0; k < TRAIL; k++) {
        const ci = i - 1 - k;
        const cell = ci >= 0 ? path[ci] : path[0];
        const fade = 1 - k / TRAIL;
        const s = 0.5 * fade + 0.06;
        dummy.position.set(cell[0], 0.04, cell[1]);
        dummy.scale.set(s, s, s);
        dummy.rotation.set(-Math.PI / 2, 0, 0);
        dummy.updateMatrix();
        tm.setMatrixAt(k, dummy.matrix);
      }
      tm.instanceMatrix.needsUpdate = true;
    }
  };

  useLayoutEffect(() => {
    place(0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((state) => {
    place(animate ? state.clock.elapsedTime : 0);
  });

  const trailGeom = useMemo(() => new THREE.PlaneGeometry(0.9, 0.9), []);

  return (
    <>
      {/* fading trail of visited cells */}
      <instancedMesh ref={trailRef} args={[trailGeom, undefined, TRAIL]}>
        <meshBasicMaterial
          color={AGENT_COLOR}
          transparent
          opacity={0.14}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </instancedMesh>

      {/* the agent token */}
      <group ref={groupRef}>
        <mesh rotation={[0, Math.PI / 4, 0]}>
          <octahedronGeometry args={[0.28, 0]} />
          <meshStandardMaterial
            color={AGENT_COLOR}
            emissive={AGENT_COLOR}
            emissiveIntensity={2.2}
            toneMapped={false}
            flatShading
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.42, 12, 12]} />
          <meshBasicMaterial
            color={AGENT_COLOR}
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
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

      <PolicyField />
      <GoalMarker animate={animate} />

      {agents.map((i) => (
        <Agent key={i} index={i} animate={animate} />
      ))}
    </>
  );
}
