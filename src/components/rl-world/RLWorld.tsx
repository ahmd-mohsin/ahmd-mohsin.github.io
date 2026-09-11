"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const CARDINAL = "#8C1515";
const GRID = [
  "###################",
  "#........#........#",
  "#.##.###.#.###.##.#",
  "#.................#",
  "#.##.#.#####.#.##.#",
  "#....#...#...#....#",
  "####.###.#.###.####",
  "#....#.......#....#",
  "#.##.#.#####.#.##.#",
  "#........#........#",
  "#.##.###.#.###.##.#",
  "#..#...........#..#",
  "##.#.#.#####.#.#.##",
  "#....#...#...#....#",
  "#.######.#.######.#",
  "#.................#",
  "###################",
] as const;

const WIDTH = GRID[0].length;
const HEIGHT = GRID.length;
const TRAIL_COUNT = 34;
const SECTOR_SEGMENTS = 56;
const TAU = Math.PI * 2;

type Cell = readonly [number, number];
type RoutePoint = { x: number; z: number; id: number };

function isCorridor(x: number, z: number): boolean {
  return (
    x >= 0 &&
    x < WIDTH &&
    z >= 0 &&
    z < HEIGHT &&
    GRID[z][x] === "."
  );
}

function makeRoute(waypoints: readonly Cell[]): RoutePoint[] {
  const cells: number[] = [waypoints[0][1] * WIDTH + waypoints[0][0]];
  const directions = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ] as const;

  for (let segment = 1; segment < waypoints.length; segment++) {
    const start = cells[cells.length - 1];
    const destination =
      waypoints[segment][1] * WIDTH + waypoints[segment][0];
    const parents = new Int32Array(WIDTH * HEIGHT);
    parents.fill(-1);
    parents[start] = start;

    const queue = [start];
    for (let head = 0; head < queue.length; head++) {
      const current = queue[head];
      if (current === destination) break;

      const x = current % WIDTH;
      const z = Math.floor(current / WIDTH);

      for (const [dx, dz] of directions) {
        const nx = x + dx;
        const nz = z + dz;
        const next = nz * WIDTH + nx;
        if (isCorridor(nx, nz) && parents[next] === -1) {
          parents[next] = current;
          queue.push(next);
        }
      }
    }

    if (parents[destination] === -1) {
      throw new Error("RLWorld route contains an unreachable cell.");
    }

    const segmentCells: number[] = [];
    let current = destination;
    while (current !== start) {
      segmentCells.push(current);
      current = parents[current];
    }
    segmentCells.reverse();
    cells.push(...segmentCells);
  }

  if (cells[cells.length - 1] === cells[0]) cells.pop();

  return cells.map((id) => ({
    x: (id % WIDTH) - (WIDTH - 1) / 2,
    z: Math.floor(id / WIDTH) - (HEIGHT - 1) / 2,
    id,
  }));
}

const AGENT_ROUTE = makeRoute([
  [4, 3],
  [17, 3],
  [17, 1],
  [10, 1],
  [10, 7],
  [17, 7],
  [17, 15],
  [10, 15],
  [10, 11],
  [4, 11],
  [4, 15],
  [1, 15],
  [1, 7],
  [4, 7],
  [4, 3],
]);

const GHOST_ROUTE = makeRoute([
  [6, 7],
  [12, 7],
  [12, 9],
  [14, 9],
  [14, 11],
  [10, 11],
  [10, 7],
  [6, 7],
]);

function sampleRoute(
  route: readonly RoutePoint[],
  progress: number,
  target: THREE.Vector3,
): number {
  const wrapped = ((progress % route.length) + route.length) % route.length;
  const index = Math.floor(wrapped);
  const fraction = wrapped - index;
  const a = route[index];
  const b = route[(index + 1) % route.length];

  target.set(
    a.x + (b.x - a.x) * fraction,
    0,
    a.z + (b.z - a.z) * fraction,
  );

  return Math.atan2(-(b.z - a.z), b.x - a.x);
}

function turnToward(current: number, target: number, amount: number): number {
  const difference = Math.atan2(
    Math.sin(target - current),
    Math.cos(target - current),
  );
  return current + difference * amount;
}

function CameraRig({ animate }: { animate: boolean }) {
  const { camera, size, invalidate } = useThree();
  const phase = useRef(0);
  const distance = useRef(28);

  useLayoutEffect(() => {
    const aspect = Math.max(size.width / Math.max(size.height, 1), 0.1);
    const halfHeight = Math.max(9.8, 10.7 / aspect);

    if (camera instanceof THREE.PerspectiveCamera) {
      const halfFov = THREE.MathUtils.degToRad(camera.getEffectiveFOV() / 2);
      distance.current = halfHeight / Math.tan(halfFov) + 2;
      camera.near = 0.1;
      camera.far = Math.max(150, distance.current + 60);
      camera.updateProjectionMatrix();
    } else if (camera instanceof THREE.OrthographicCamera) {
      camera.left = -halfHeight * aspect;
      camera.right = halfHeight * aspect;
      camera.top = halfHeight;
      camera.bottom = -halfHeight;
      camera.zoom = 1;
      camera.near = 0.1;
      camera.far = 150;
      camera.updateProjectionMatrix();
      distance.current = 30;
    }

    phase.current = 0;
    camera.position.set(
      0,
      distance.current * 0.91,
      distance.current * 0.415,
    );
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    invalidate();
  }, [camera, size.width, size.height, animate, invalidate]);

  useFrame((_, delta) => {
    if (!animate) return;

    phase.current += Math.min(delta, 0.06);
    const t = phase.current;

    camera.position.set(
      Math.sin(t * 0.065) * 0.58,
      distance.current * 0.91 + Math.sin(t * 0.047) * 0.18,
      distance.current * 0.415 + Math.sin(t * 0.052) * 0.32,
    );
    camera.lookAt(
      Math.sin(t * 0.039) * 0.12,
      0,
      Math.sin(t * 0.033) * 0.1,
    );
    invalidate();
  });

  return null;
}

export default function RLWorld({ animate = true }: { animate?: boolean }) {
  const wallsRef = useRef<THREE.InstancedMesh>(null!);
  const footingsRef = useRef<THREE.InstancedMesh>(null!);
  const pelletsRef = useRef<THREE.InstancedMesh>(null!);
  const trailRef = useRef<THREE.InstancedMesh>(null!);
  const agentRef = useRef<THREE.Group>(null!);
  const ghostRef = useRef<THREE.Group>(null!);
  const invalidate = useThree((state) => state.invalidate);

  const layout = useMemo(() => {
    const walls: { x: number; z: number; rotation: number }[] = [];
    const pellets: {
      x: number;
      z: number;
      id: number;
      power: boolean;
    }[] = [];
    const pelletByCell = new Int32Array(WIDTH * HEIGHT);
    pelletByCell.fill(-1);

    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const;

    for (let z = 0; z < HEIGHT; z++) {
      for (let x = 0; x < WIDTH; x++) {
        const worldX = x - (WIDTH - 1) / 2;
        const worldZ = z - (HEIGHT - 1) / 2;

        if (isCorridor(x, z)) {
          const id = z * WIDTH + x;
          pelletByCell[id] = pellets.length;
          pellets.push({
            x: worldX,
            z: worldZ,
            id,
            power:
              (x === 1 || x === WIDTH - 2) &&
              (z === 1 || z === HEIGHT - 2),
          });
        } else {
          // Outline occupied grid cells; shared internal edges are omitted.
          for (const [dx, dz] of directions) {
            if (!isCorridor(x + dx, z + dz)) continue;
            walls.push({
              x: worldX + dx * 0.5,
              z: worldZ + dz * 0.5,
              rotation: dx === 0 ? 0 : Math.PI / 2,
            });
          }
        }
      }
    }

    return { walls, pellets, pelletByCell };
  }, []);

  const assets = useMemo(() => {
    const barShape = new THREE.Shape();
    const radius = 0.082;
    barShape.moveTo(-0.5, -radius);
    barShape.lineTo(0.5, -radius);
    barShape.absarc(0.5, 0, radius, -Math.PI / 2, Math.PI / 2, false);
    barShape.lineTo(-0.5, radius);
    barShape.absarc(-0.5, 0, radius, Math.PI / 2, Math.PI * 1.5, false);
    barShape.closePath();

    const wall = new THREE.ExtrudeGeometry(barShape, {
      depth: 0.15,
      bevelEnabled: true,
      bevelSize: 0.022,
      bevelThickness: 0.022,
      bevelSegments: 2,
      steps: 1,
      curveSegments: 5,
    });
    wall.rotateX(-Math.PI / 2);

    const agent = new THREE.CircleGeometry(
      0.415,
      SECTOR_SEGMENTS,
      0.34,
      TAU - 0.68,
    );
    (agent.getAttribute("position") as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);
    agent.computeBoundingSphere();

    const dome = new THREE.SphereGeometry(
      0.345,
      24,
      12,
      0,
      TAU,
      0,
      Math.PI / 2,
    );
    const skirt = new THREE.CylinderGeometry(
      0.345,
      0.37,
      0.3,
      32,
      1,
      true,
    );
    const skirtPositions = skirt.getAttribute("position");
    for (let i = 0; i < skirtPositions.count; i++) {
      if (skirtPositions.getY(i) < 0) {
        const angle = Math.atan2(
          skirtPositions.getZ(i),
          skirtPositions.getX(i),
        );
        skirtPositions.setY(i, -0.15 + Math.cos(angle * 6) * 0.035);
      }
    }
    skirt.computeVertexNormals();

    return {
      geometries: {
        wall,
        agent,
        dome,
        skirt,
        sphere: new THREE.SphereGeometry(1, 12, 8),
        trail: new THREE.CircleGeometry(1, 12),
      },
      materials: {
        wall: new THREE.MeshStandardMaterial({
          color: CARDINAL,
          roughness: 0.7,
          metalness: 0,
        }),
        footing: new THREE.MeshBasicMaterial({
          color: "#e5e5e5",
        }),
        pellet: new THREE.MeshStandardMaterial({
          color: "#ffffff",
          roughness: 1,
          transparent: true,
          opacity: 0.64,
          depthWrite: false,
        }),
        trail: new THREE.MeshBasicMaterial({
          color: "#ffffff",
          depthWrite: false,
        }),
        agent: new THREE.MeshBasicMaterial({
          color: CARDINAL,
          side: THREE.DoubleSide,
        }),
        ghost: new THREE.MeshStandardMaterial({
          color: "#c7c7c7",
          roughness: 0.9,
        }),
        white: new THREE.MeshBasicMaterial({ color: "#ffffff" }),
        red: new THREE.MeshBasicMaterial({ color: CARDINAL }),
        ink: new THREE.MeshBasicMaterial({ color: "#1a1a1a" }),
      },
    };
  }, []);

  const simulation = useMemo(
    () => ({
      time: 0,
      progress: 2.35,
      lastStep: -1,
      agentHeading: 0,
      ghostHeading: 0,
      eaten: new Uint8Array(layout.pellets.length),
      dummy: new THREE.Object3D(),
      position: new THREE.Vector3(),
      trailPosition: new THREE.Vector3(),
      color: new THREE.Color(),
      red: new THREE.Color(CARDINAL),
    }),
    [layout],
  );

  function updateScene(delta: number, moving: boolean) {
    const pellets = pelletsRef.current;
    const trail = trailRef.current;
    const agent = agentRef.current;
    const ghost = ghostRef.current;
    if (!pellets || !trail || !agent || !ghost) return;

    const s = simulation;
    if (moving) {
      s.time += delta;
      s.progress += delta * 1.38;
    }

    const step = Math.floor(s.progress);
    while (s.lastStep < step) {
      s.lastStep++;
      const routeIndex = s.lastStep % AGENT_ROUTE.length;
      if (routeIndex === 0) s.eaten.fill(0);
      const pelletIndex =
        layout.pelletByCell[AGENT_ROUTE[routeIndex].id];
      if (pelletIndex >= 0) s.eaten[pelletIndex] = 1;
    }

    s.dummy.rotation.set(0, 0, 0);
    for (let i = 0; i < layout.pellets.length; i++) {
      const pellet = layout.pellets[i];
      const pulse = moving ? 1 + Math.sin(s.time * 2.1 + i) * 0.1 : 1;
      const radius = s.eaten[i]
        ? 0
        : pellet.power
          ? 0.135 * pulse
          : 0.047;

      s.dummy.position.set(pellet.x, pellet.power ? 0.145 : 0.072, pellet.z);
      s.dummy.scale.setScalar(radius);
      s.dummy.updateMatrix();
      pellets.setMatrixAt(i, s.dummy.matrix);
    }
    pellets.instanceMatrix.needsUpdate = true;

    const heading = sampleRoute(AGENT_ROUTE, s.progress, s.position);
    s.agentHeading = moving
      ? turnToward(s.agentHeading, heading, 1 - Math.exp(-delta * 13))
      : heading;
    agent.position.set(s.position.x, 0.17, s.position.z);
    agent.rotation.y = s.agentHeading;

    const mouthAngle = moving
      ? 0.105 + (0.5 + 0.5 * Math.sin(s.time * 9.2)) * 0.43
      : 0.36;
    const positions = assets.geometries.agent.getAttribute("position");
    for (let i = 0; i <= SECTOR_SEGMENTS; i++) {
      const angle =
        mouthAngle + (i / SECTOR_SEGMENTS) * (TAU - mouthAngle * 2);
      positions.setXYZ(
        i + 1,
        Math.cos(angle) * 0.415,
        Math.sin(angle) * 0.415,
        0,
      );
    }
    positions.needsUpdate = true;

    s.dummy.rotation.set(-Math.PI / 2, 0, 0);
    for (let i = 0; i < TRAIL_COUNT; i++) {
      const behind = (i + 1) * 0.145;
      sampleRoute(AGENT_ROUTE, s.progress - behind, s.trailPosition);
      const age = i / TRAIL_COUNT;
      const radius = s.progress >= behind ? 0.087 * (1 - age * 0.7) : 0;

      s.dummy.position.set(s.trailPosition.x, 0.035, s.trailPosition.z);
      s.dummy.scale.setScalar(radius);
      s.dummy.updateMatrix();
      trail.setMatrixAt(i, s.dummy.matrix);
    }
    trail.instanceMatrix.needsUpdate = true;

    const ghostHeading = sampleRoute(
      GHOST_ROUTE,
      3.2 + s.time * 0.79,
      s.position,
    );
    s.ghostHeading = moving
      ? turnToward(s.ghostHeading, ghostHeading, 1 - Math.exp(-delta * 7))
      : ghostHeading;
    ghost.position.set(
      s.position.x,
      0.075 + (moving ? Math.sin(s.time * 2.2) * 0.032 : 0),
      s.position.z,
    );
    ghost.rotation.y = s.ghostHeading;
  }

  useLayoutEffect(() => {
    const walls = wallsRef.current;
    const footings = footingsRef.current;
    const pellets = pelletsRef.current;
    const trail = trailRef.current;
    if (!walls || !footings || !pellets || !trail) return;

    const s = simulation;
    s.time = 0;
    s.progress = 2.35;
    s.lastStep = -1;
    s.eaten.fill(0);

    for (let i = 0; i < layout.walls.length; i++) {
      const wall = layout.walls[i];
      s.dummy.position.set(wall.x, 0.05, wall.z);
      s.dummy.rotation.set(0, wall.rotation, 0);
      s.dummy.scale.set(1, 1, 1);
      s.dummy.updateMatrix();
      walls.setMatrixAt(i, s.dummy.matrix);

      s.dummy.position.y = 0.009;
      s.dummy.scale.set(1.035, 0.085, 1.55);
      s.dummy.updateMatrix();
      footings.setMatrixAt(i, s.dummy.matrix);
    }
    walls.instanceMatrix.needsUpdate = true;
    footings.instanceMatrix.needsUpdate = true;

    pellets.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    trail.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    for (let i = 0; i < layout.pellets.length; i++) {
      s.color.set(layout.pellets[i].power ? CARDINAL : "#9a9a9a");
      pellets.setColorAt(i, s.color);
    }

    for (let i = 0; i < TRAIL_COUNT; i++) {
      const strength = Math.pow(1 - i / TRAIL_COUNT, 1.65) * 0.32;
      s.color.set("#ffffff").lerp(s.red, strength);
      trail.setColorAt(i, s.color);
    }

    if (pellets.instanceColor) pellets.instanceColor.needsUpdate = true;
    if (trail.instanceColor) trail.instanceColor.needsUpdate = true;

    updateScene(0, false);
    invalidate();
  }, [animate, layout, assets, simulation, invalidate]);

  useLayoutEffect(() => {
    return () => {
      for (const geometry of Object.values(assets.geometries)) {
        geometry.dispose();
      }
      for (const material of Object.values(assets.materials)) {
        material.dispose();
      }
    };
  }, [assets]);

  useFrame((_, delta) => {
    if (!animate) return;
    updateScene(Math.min(delta, 0.06), true);
  });

  return (
    <>
      <color attach="background" args={["#ffffff"]} />

      <CameraRig animate={animate} />

      <ambientLight intensity={1.15} />
      <hemisphereLight args={["#ffffff", "#e5e5e5", 1.35]} />
      <directionalLight position={[-7, 16, 8]} intensity={2.1} />
      <directionalLight position={[9, 10, -8]} intensity={0.55} />

      <group dispose={null}>
        <instancedMesh
          ref={footingsRef}
          args={[
            assets.geometries.wall,
            assets.materials.footing,
            layout.walls.length,
          ]}
          frustumCulled={false}
        />
        <instancedMesh
          ref={wallsRef}
          args={[
            assets.geometries.wall,
            assets.materials.wall,
            layout.walls.length,
          ]}
          frustumCulled={false}
        />
        <instancedMesh
          ref={trailRef}
          args={[
            assets.geometries.trail,
            assets.materials.trail,
            TRAIL_COUNT,
          ]}
          frustumCulled={false}
        />
        <instancedMesh
          ref={pelletsRef}
          args={[
            assets.geometries.sphere,
            assets.materials.pellet,
            layout.pellets.length,
          ]}
          frustumCulled={false}
        />

        <group ref={agentRef}>
          <mesh
            geometry={assets.geometries.agent}
            material={assets.materials.agent}
            rotation={[-Math.PI / 2, 0, 0]}
          />
          <mesh
            geometry={assets.geometries.sphere}
            material={assets.materials.ink}
            position={[0.095, 0.015, -0.218]}
            scale={[0.034, 0.012, 0.034]}
          />
        </group>

        <group ref={ghostRef}>
          <mesh
            geometry={assets.geometries.dome}
            material={assets.materials.ghost}
            position={[0, 0.355, 0]}
          />
          <mesh
            geometry={assets.geometries.skirt}
            material={assets.materials.ghost}
            position={[0, 0.205, 0]}
          />
          <mesh
            geometry={assets.geometries.sphere}
            material={assets.materials.white}
            position={[0.31, 0.405, -0.13]}
            scale={[0.051, 0.088, 0.068]}
          />
          <mesh
            geometry={assets.geometries.sphere}
            material={assets.materials.white}
            position={[0.31, 0.405, 0.13]}
            scale={[0.051, 0.088, 0.068]}
          />
          <mesh
            geometry={assets.geometries.sphere}
            material={assets.materials.red}
            position={[0.352, 0.406, -0.13]}
            scale={[0.019, 0.042, 0.029]}
          />
          <mesh
            geometry={assets.geometries.sphere}
            material={assets.materials.red}
            position={[0.352, 0.406, 0.13]}
            scale={[0.019, 0.042, 0.029]}
          />
        </group>
      </group>

      <group position={[1, 0.025, 7]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.31, 0.335, 48]} />
          <meshBasicMaterial color={CARDINAL} transparent opacity={0.45} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.395, 0.41, 48]} />
          <meshBasicMaterial color="#c7c7c7" transparent opacity={0.7} />
        </mesh>
      </group>
    </>
  );
}
