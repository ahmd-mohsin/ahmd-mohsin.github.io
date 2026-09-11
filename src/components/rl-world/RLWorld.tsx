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
const CELL_COUNT = WIDTH * HEIGHT;
const TRAIL_COUNT = 34;
const TRAIL_SPACING = 0.145;
const SECTOR_SEGMENTS = 56;
const TAU = Math.PI * 2;
const START = 3 * WIDTH + 4;
const GOAL = 15 * WIDTH + 10;
const EPISODES_PER_CYCLE = 11;
const DISCOUNT = 0.965;
const POWER_DURATION = 2.6;
const CAPTURE_DISTANCE_SQ = 0.49 * 0.49;

const DIRECTIONS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
] as const;

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

function cellX(id: number): number {
  return (id % WIDTH) - (WIDTH - 1) / 2;
}

function cellZ(id: number): number {
  return Math.floor(id / WIDTH) - (HEIGHT - 1) / 2;
}

// Only the ghost has a prescribed patrol. The agent never follows a route.
function makeRoute(waypoints: readonly Cell[]): RoutePoint[] {
  const cells: number[] = [waypoints[0][1] * WIDTH + waypoints[0][0]];

  for (let segment = 1; segment < waypoints.length; segment++) {
    const start = cells[cells.length - 1];
    const destination =
      waypoints[segment][1] * WIDTH + waypoints[segment][0];
    const parents = new Int32Array(CELL_COUNT);
    parents.fill(-1);
    parents[start] = start;

    const queue = [start];
    for (let head = 0; head < queue.length; head++) {
      const current = queue[head];
      if (current === destination) break;

      const x = current % WIDTH;
      const z = Math.floor(current / WIDTH);

      for (const [dx, dz] of DIRECTIONS) {
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
      throw new Error("RLWorld patrol contains an unreachable cell.");
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
    x: cellX(id),
    z: cellZ(id),
    id,
  }));
}

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
  const policyRef = useRef<THREE.InstancedMesh>(null!);
  const agentRef = useRef<THREE.Group>(null!);
  const ghostRef = useRef<THREE.Group>(null!);
  const goalRef = useRef<THREE.Group>(null!);
  const burstRef = useRef<THREE.Mesh>(null!);
  const invalidate = useThree((state) => state.invalidate);

  const layout = useMemo(() => {
    const walls: { x: number; z: number; rotation: number }[] = [];
    const pellets: {
      x: number;
      z: number;
      id: number;
      power: boolean;
    }[] = [];
    const pelletByCell = new Int32Array(CELL_COUNT);
    const neighbors = new Int32Array(CELL_COUNT * 4);
    const degree = new Uint8Array(CELL_COUNT);
    pelletByCell.fill(-1);
    neighbors.fill(-1);

    for (let z = 0; z < HEIGHT; z++) {
      for (let x = 0; x < WIDTH; x++) {
        const id = z * WIDTH + x;
        const worldX = cellX(id);
        const worldZ = cellZ(id);

        if (isCorridor(x, z)) {
          pelletByCell[id] = pellets.length;
          pellets.push({
            x: worldX,
            z: worldZ,
            id,
            power:
              (x === 1 || x === WIDTH - 2) &&
              (z === 1 || z === HEIGHT - 2),
          });

          for (let action = 0; action < 4; action++) {
            const [dx, dz] = DIRECTIONS[action];
            if (isCorridor(x + dx, z + dz)) {
              neighbors[id * 4 + action] = (z + dz) * WIDTH + x + dx;
              degree[id]++;
            }
          }
        } else {
          for (const [dx, dz] of DIRECTIONS) {
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

    return { walls, pellets, pelletByCell, neighbors, degree };
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
    (agent.getAttribute("position") as THREE.BufferAttribute).setUsage(
      THREE.DynamicDrawUsage,
    );
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
    const skirt = new THREE.CylinderGeometry(0.345, 0.37, 0.3, 32, 1, true);
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

    const chevronShape = new THREE.Shape();
    chevronShape.moveTo(-0.115, -0.1);
    chevronShape.lineTo(-0.06, -0.14);
    chevronShape.lineTo(0.14, 0);
    chevronShape.lineTo(-0.06, 0.14);
    chevronShape.lineTo(-0.115, 0.1);
    chevronShape.lineTo(0.025, 0);
    chevronShape.closePath();

    return {
      geometries: {
        wall,
        agent,
        dome,
        skirt,
        sphere: new THREE.SphereGeometry(1, 12, 8),
        trail: new THREE.CircleGeometry(1, 12),
        policy: new THREE.ShapeGeometry(chevronShape),
        goalInner: new THREE.RingGeometry(0.31, 0.335, 48),
        goalOuter: new THREE.RingGeometry(0.395, 0.41, 48),
        burst: new THREE.RingGeometry(0.46, 0.475, 48),
      },
      materials: {
        wall: new THREE.MeshStandardMaterial({
          color: CARDINAL,
          roughness: 0.7,
          metalness: 0,
        }),
        footing: new THREE.MeshBasicMaterial({ color: "#e5e5e5" }),
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
        policy: new THREE.MeshBasicMaterial({
          color: "#ffffff",
          side: THREE.DoubleSide,
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
        goalInner: new THREE.MeshBasicMaterial({
          color: CARDINAL,
          transparent: true,
          opacity: 0.45,
          depthWrite: false,
        }),
        goalOuter: new THREE.MeshBasicMaterial({
          color: "#c7c7c7",
          transparent: true,
          opacity: 0.7,
          depthWrite: false,
        }),
        burst: new THREE.MeshBasicMaterial({
          color: CARDINAL,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          side: THREE.DoubleSide,
        }),
      },
    };
  }, []);

  const simulation = useMemo(
    () => ({
      time: 0,
      episode: 0,
      epsilon: 0.94,
      confidence: 0,
      steps: 0,
      cell: START,
      next: START,
      action: -1,
      fraction: 0,
      wait: 0.32,
      ending: 0,
      endingDuration: 1,
      outcome: 0,
      power: 0,
      rewardFlash: 0,
      agentHeading: 0,
      targetHeading: 0,
      ghostHeading: 0,
      ghostProgress: 3.2,

      // Q(s,a) is learned, not initialized from a path or distance field.
      // Cell-state aggregation learns expected risk over the moving patrol.
      q: new Float32Array(CELL_COUNT * 4),
      updates: new Uint32Array(CELL_COUNT * 4),
      eaten: new Uint8Array(layout.pellets.length),

      randomSeed: 0x4f31a2b7,
      practiceSeed: 0x17c9e53d,
      practiceClock: 0,
      practiceCell: START,
      practiceSteps: 0,
      practiceProgress: 3.2,
      practicePower: 0,
      practiceEpisode: 1,
      practiceEaten: new Uint32Array(layout.pellets.length),

      trailX: new Float32Array(TRAIL_COUNT),
      trailZ: new Float32Array(TRAIL_COUNT),
      trailHead: -1,
      trailLength: 0,
      trailRemainder: 0,
      previousX: cellX(START),
      previousZ: cellZ(START),

      policyHeading: new Float32Array(layout.pellets.length),
      policyNoise: new Float32Array(layout.pellets.length),
      policyAction: new Uint8Array(layout.pellets.length),

      dummy: new THREE.Object3D(),
      position: new THREE.Vector3(cellX(START), 0, cellZ(START)),
      ghostPosition: new THREE.Vector3(),
      practicePosition: new THREE.Vector3(),
      color: new THREE.Color(),
      accent: new THREE.Color(),
      red: new THREE.Color(CARDINAL),
      grey: new THREE.Color("#9a9a9a"),
      paleGrey: new THREE.Color("#c7c7c7"),
      white: new THREE.Color("#ffffff"),
    }),
    [layout],
  );

  function random(practice = false): number {
    const s = simulation;
    let seed = practice ? s.practiceSeed : s.randomSeed;
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    if (practice) s.practiceSeed = seed >>> 0;
    else s.randomSeed = seed >>> 0;
    return (seed >>> 0) / 4294967296;
  }

  function randomAction(cell: number, practice = false): number {
    let index = Math.floor(random(practice) * layout.degree[cell]);
    for (let action = 0; action < 4; action++) {
      if (layout.neighbors[cell * 4 + action] < 0) continue;
      if (index-- === 0) return action;
    }
    return 0;
  }

  function bestAction(cell: number): number {
    const q = simulation.q;
    let best = -Infinity;
    let selected = 0;

    // Stable, cell-specific tie breaking avoids a global directional bias.
    const offset = (cell * 13 + Math.floor(cell / WIDTH)) & 3;
    for (let i = 0; i < 4; i++) {
      const action = (i + offset) & 3;
      if (layout.neighbors[cell * 4 + action] < 0) continue;
      const value = q[cell * 4 + action];
      if (value > best) {
        best = value;
        selected = action;
      }
    }
    return selected;
  }

  function learn(
    cell: number,
    action: number,
    next: number,
    reward: number,
    terminal: boolean,
  ) {
    const s = simulation;
    const index = cell * 4 + action;
    const target =
      reward + (terminal ? 0 : DISCOUNT * s.q[next * 4 + bestAction(next)]);
    const count = ++s.updates[index];
    const alpha = Math.max(0.035, 0.3 / (1 + count * 0.012));
    s.q[index] += alpha * (target - s.q[index]);
  }

  function resetPractice() {
    const s = simulation;
    let index = Math.floor(random(true) * layout.pellets.length);
    if (layout.pellets[index].id === GOAL) {
      index = (index + 1) % layout.pellets.length;
    }

    s.practiceCell = layout.pellets[index].id;
    s.practiceSteps = 0;
    s.practiceProgress = random(true) * GHOST_ROUTE.length;
    s.practicePower = 0;
    s.practiceEpisode++;
    s.practiceEaten[index] = s.practiceEpisode;
  }

  function practiceStep() {
    const s = simulation;
    const cell = s.practiceCell;
    const action =
      random(true) < Math.max(0.24, s.epsilon)
        ? randomAction(cell, true)
        : bestAction(cell);
    const next = layout.neighbors[cell * 4 + action];
    const speed =
      (2.4 + (1 - s.epsilon) * 0.95) *
      (s.practicePower > 0 ? 1.24 : 1);
    const duration = 1 / speed;
    const ghostAdvance = duration * 0.79;
    const x = cellX(cell);
    const z = cellZ(cell);
    const nx = cellX(next);
    const nz = cellZ(next);

    // Sample a real moving patrol, rather than prescribing forbidden cells.
    sampleRoute(
      GHOST_ROUTE,
      s.practiceProgress + ghostAdvance * 0.5,
      s.practicePosition,
    );
    let dx = (x + nx) * 0.5 - s.practicePosition.x;
    let dz = (z + nz) * 0.5 - s.practicePosition.z;
    const midpointDistance = dx * dx + dz * dz;

    s.practiceProgress =
      (s.practiceProgress + ghostAdvance) % GHOST_ROUTE.length;
    sampleRoute(GHOST_ROUTE, s.practiceProgress, s.practicePosition);
    dx = nx - s.practicePosition.x;
    dz = nz - s.practicePosition.z;
    const endDistance = dx * dx + dz * dz;

    const caught =
      s.practicePower <= duration &&
      Math.min(midpointDistance, endDistance) < CAPTURE_DISTANCE_SQ;

    s.practicePower = Math.max(0, s.practicePower - duration);
    let reward = -0.14;
    let terminal = caught;

    if (caught) {
      reward = -12;
    } else {
      const pelletIndex = layout.pelletByCell[next];
      if (s.practiceEaten[pelletIndex] !== s.practiceEpisode) {
        s.practiceEaten[pelletIndex] = s.practiceEpisode;
        reward += 0.22;
        if (layout.pellets[pelletIndex].power) {
          reward += 0.7;
          s.practicePower = POWER_DURATION;
        }
      }

      if (s.practicePower === 0 && endDistance < 1.8) reward -= 0.3;
      if (next === GOAL) {
        reward += 18;
        terminal = true;
      }
    }

    learn(cell, action, next, reward, terminal);
    s.practiceCell = next;
    s.practiceSteps++;

    if (terminal || s.practiceSteps >= 64) resetPractice();
  }

  function resetEpisode(clearLearning: boolean) {
    const s = simulation;

    if (clearLearning) {
      s.q.fill(0);
      s.updates.fill(0);
      s.practiceEaten.fill(0);
      s.practiceEpisode = 1;
      s.practiceClock = 0;
      s.confidence = 0;
      resetPractice();
    }

    s.epsilon = Math.max(0.025, 0.94 * Math.pow(0.64, s.episode));
    s.steps = 0;
    s.cell = START;
    s.next = START;
    s.action = -1;
    s.fraction = 0;
    s.wait = 0.32;
    s.ending = 0;
    s.outcome = 0;
    s.power = 0;
    s.rewardFlash = 0;
    s.eaten.fill(0);
    s.eaten[layout.pelletByCell[START]] = 1;
    s.position.set(cellX(START), 0, cellZ(START));
    s.previousX = s.position.x;
    s.previousZ = s.position.z;
    s.trailHead = -1;
    s.trailLength = 0;
    s.trailRemainder = 0;
    s.agentHeading = 0;
    s.targetHeading = 0;

    for (let i = 0; i < layout.pellets.length; i++) {
      const action = randomAction(layout.pellets[i].id);
      s.policyAction[i] = action;
      s.policyNoise[i] = random();
      if (clearLearning) {
        s.policyHeading[i] = -action * Math.PI / 2;
      }
    }
  }

  function finishEpisode(outcome: number) {
    const s = simulation;
    if (s.ending > 0) return;
    s.outcome = outcome;
    s.endingDuration = outcome === 1 ? 1.25 : 0.8;
    s.ending = s.endingDuration;
    s.action = -1;
  }

  function recordTrail() {
    const s = simulation;
    const dx = s.position.x - s.previousX;
    const dz = s.position.z - s.previousZ;
    const length = Math.sqrt(dx * dx + dz * dz);

    if (length > 0.00001) {
      let distance = TRAIL_SPACING - s.trailRemainder;
      while (distance <= length) {
        const fraction = distance / length;
        s.trailHead = (s.trailHead + 1) % TRAIL_COUNT;
        s.trailX[s.trailHead] = s.previousX + dx * fraction;
        s.trailZ[s.trailHead] = s.previousZ + dz * fraction;
        s.trailLength = Math.min(TRAIL_COUNT, s.trailLength + 1);
        distance += TRAIL_SPACING;
      }
      s.trailRemainder = (s.trailRemainder + length) % TRAIL_SPACING;
    }

    s.previousX = s.position.x;
    s.previousZ = s.position.z;
  }

  function advanceAgent(delta: number) {
    const s = simulation;

    if (s.ending > 0) {
      s.ending = Math.max(0, s.ending - delta);
      if (s.ending === 0) {
        s.episode++;
        const clearLearning = s.episode >= EPISODES_PER_CYCLE;
        if (clearLearning) s.episode = 0;
        resetEpisode(clearLearning);
      }
      return;
    }

    s.power = Math.max(0, s.power - delta);
    s.rewardFlash = Math.max(0, s.rewardFlash - delta);

    if (s.wait > 0) {
      s.wait = Math.max(0, s.wait - delta);
    } else {
      if (s.action < 0) {
        // Exploration can reverse direction, enter dead ends, or approach
        // danger. Exploitation reads only learned action values.
        s.action =
          random() < s.epsilon
            ? randomAction(s.cell)
            : bestAction(s.cell);
        s.next = layout.neighbors[s.cell * 4 + s.action];
        s.fraction = 0;
        s.targetHeading = -s.action * Math.PI / 2;
      }

      const speed =
        (2.4 + (1 - s.epsilon) * 0.95) * (s.power > 0 ? 1.24 : 1);
      s.fraction = Math.min(1, s.fraction + delta * speed);
      s.position.set(
        THREE.MathUtils.lerp(cellX(s.cell), cellX(s.next), s.fraction),
        0,
        THREE.MathUtils.lerp(cellZ(s.cell), cellZ(s.next), s.fraction),
      );
      recordTrail();
    }

    const dx = s.position.x - s.ghostPosition.x;
    const dz = s.position.z - s.ghostPosition.z;
    const distance = dx * dx + dz * dz;

    if (s.power <= 0 && distance < CAPTURE_DISTANCE_SQ) {
      if (s.action >= 0) {
        learn(s.cell, s.action, s.next, -12, true);
      } else {
        // Being caught while hesitating makes the exposed cell less valuable.
        for (let action = 0; action < 4; action++) {
          const next = layout.neighbors[s.cell * 4 + action];
          if (next >= 0) learn(s.cell, action, next, -12, true);
        }
      }
      finishEpisode(-1);
      return;
    }

    if (s.action < 0 || s.fraction < 1) return;

    let reward = -0.14;
    const pelletIndex = layout.pelletByCell[s.next];
    if (!s.eaten[pelletIndex]) {
      s.eaten[pelletIndex] = 1;
      s.rewardFlash = 0.16;
      reward += 0.22;

      if (layout.pellets[pelletIndex].power) {
        s.power = POWER_DURATION;
        reward += 0.7;
      }
    }

    if (s.power === 0 && distance < 1.8) reward -= 0.3;
    const success = s.next === GOAL;
    if (success) reward += 18;

    learn(s.cell, s.action, s.next, reward, success);
    s.cell = s.next;
    s.action = -1;
    s.fraction = 0;
    s.steps++;

    if (success) {
      finishEpisode(1);
    } else if (s.steps >= 44 + s.episode * 2) {
      // A time limit is a truncation, not a terminal negative reward.
      finishEpisode(-2);
    } else {
      const degree = layout.degree[s.cell];
      s.wait =
        degree >= 3 && random() < s.epsilon
          ? 0.12 + random() * 0.4 * s.epsilon
          : degree === 1
            ? 0.06 + 0.3 * s.epsilon
            : 0;
    }
  }

  function updateScene(delta: number, moving: boolean) {
    const pellets = pelletsRef.current;
    const trail = trailRef.current;
    const policy = policyRef.current;
    const agent = agentRef.current;
    const ghost = ghostRef.current;
    const goal = goalRef.current;
    const burst = burstRef.current;
    if (!pellets || !trail || !policy || !agent || !ghost || !goal || !burst) {
      return;
    }

    const s = simulation;

    if (moving) {
      s.time += delta;
      s.ghostProgress =
        (s.ghostProgress + delta * 0.79) % GHOST_ROUTE.length;

      // Accelerated, model-generated practice makes sparse terminal rewards
      // learnable at background-animation timescales. These are ordinary
      // epsilon-greedy Q-learning rollouts, with fresh reward masks and random
      // starting cells/patrol phases—not a hidden shortest-path solution.
      // Fixed-size work and preallocated storage keep the frame loop bounded.
      if (s.ending === 0) {
        s.practiceClock += delta;
        while (s.practiceClock >= 1 / 30) {
          s.practiceClock -= 1 / 30;
          for (let i = 0; i < 48; i++) practiceStep();
        }
      }
    }

    const ghostHeading = sampleRoute(
      GHOST_ROUTE,
      s.ghostProgress,
      s.ghostPosition,
    );

    if (moving) advanceAgent(delta);

    const learnedValue = s.q[START * 4 + bestAction(START)];
    const confidenceTarget =
      (1 - s.epsilon) * THREE.MathUtils.clamp(learnedValue / 3, 0, 1);
    if (moving) {
      s.confidence +=
        (confidenceTarget - s.confidence) * (1 - Math.exp(-delta * 2.5));
    }

    const powered = s.power > 0;
    const accentStrength = powered ? 1 : s.confidence;
    s.accent.copy(s.grey).lerp(s.red, accentStrength);

    s.dummy.rotation.set(0, 0, 0);
    for (let i = 0; i < layout.pellets.length; i++) {
      const pellet = layout.pellets[i];
      const pulse = 1 + Math.sin(s.time * 2.1 + i) * 0.1;
      const radius = s.eaten[i]
        ? 0
        : pellet.power
          ? 0.135 * pulse
          : 0.047;

      s.dummy.position.set(
        pellet.x,
        pellet.power ? 0.145 : 0.072,
        pellet.z,
      );
      s.dummy.scale.setScalar(radius);
      s.dummy.updateMatrix();
      pellets.setMatrixAt(i, s.dummy.matrix);
    }
    pellets.instanceMatrix.needsUpdate = true;

    const hesitation =
      s.wait > 0 && s.ending === 0
        ? Math.sin(s.time * 10) * 0.13 * s.epsilon
        : 0;
    s.agentHeading = moving
      ? turnToward(
          s.agentHeading,
          s.targetHeading + hesitation,
          1 - Math.exp(-delta * 13),
        )
      : s.agentHeading;

    agent.position.set(s.position.x, 0.17, s.position.z);
    agent.rotation.y = s.agentHeading;

    const endingProgress =
      s.ending > 0 ? 1 - s.ending / s.endingDuration : 0;
    const caughtScale =
      s.outcome === -1 && s.ending > 0
        ? Math.max(0.06, 1 - endingProgress * 1.3)
        : 1;
    const rewardScale = 1 + s.rewardFlash * 0.17;
    const powerScale = powered ? 1.045 + Math.sin(s.time * 8) * 0.015 : 1;
    agent.scale.setScalar(caughtScale * rewardScale * powerScale);

    const mouthAngle =
      s.ending > 0
        ? 0.22
        : 0.105 +
          (0.5 + 0.5 * Math.sin(s.time * (powered ? 12.5 : 9.2))) * 0.43;
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

    burst.visible = powered && s.ending === 0;
    burst.scale.setScalar(1 + (1 - s.power / POWER_DURATION) * 0.23);
    assets.materials.burst.opacity = powered
      ? Math.min(1, s.power / 0.45) * (0.2 + Math.sin(s.time * 7) * 0.04)
      : 0;

    s.dummy.rotation.set(-Math.PI / 2, 0, 0);
    for (let i = 0; i < TRAIL_COUNT; i++) {
      const index = (s.trailHead - i + TRAIL_COUNT) % TRAIL_COUNT;
      const age = i / TRAIL_COUNT;
      const fade = s.ending > 0 ? 1 - endingProgress : 1;
      const radius =
        i < s.trailLength ? 0.087 * (1 - age * 0.7) * fade : 0;

      s.dummy.position.set(s.trailX[index], 0.035, s.trailZ[index]);
      s.dummy.scale.setScalar(radius);
      s.dummy.updateMatrix();
      trail.setMatrixAt(i, s.dummy.matrix);

      const strength =
        Math.pow(1 - age, 1.65) * (powered ? 0.43 : 0.32);
      s.color.copy(s.white).lerp(s.accent, strength);
      trail.setColorAt(i, s.color);
    }
    trail.instanceMatrix.needsUpdate = true;
    if (trail.instanceColor) trail.instanceColor.needsUpdate = true;

    for (let i = 0; i < layout.pellets.length; i++) {
      const pellet = layout.pellets[i];
      const best = bestAction(pellet.id);
      const exploring = s.policyNoise[i] < s.epsilon;
      const action = exploring ? s.policyAction[i] : best;
      const heading = -action * Math.PI / 2;

      s.policyHeading[i] = moving
        ? turnToward(
            s.policyHeading[i],
            heading,
            1 - Math.exp(-delta * (2.4 + s.confidence * 4)),
          )
        : s.policyHeading[i];

      const index = pellet.id * 4 + best;
      const evidence =
        Math.min(1, s.updates[index] / 24) *
        THREE.MathUtils.clamp(s.q[index] / 2.5, 0, 1);
      const confidence = exploring ? s.confidence * 0.15 : s.confidence * evidence;

      // Local +X points along the same heading convention as Pac-Man.
      s.dummy.rotation.set(-Math.PI / 2, 0, s.policyHeading[i]);
      s.dummy.position.set(pellet.x, 0.021, pellet.z);
      s.dummy.scale.setScalar(
        pellet.id === GOAL ? 0 : 0.63 + confidence * 0.37,
      );
      s.dummy.updateMatrix();
      policy.setMatrixAt(i, s.dummy.matrix);

      s.accent.copy(s.paleGrey).lerp(s.red, confidence);
      s.color.copy(s.white).lerp(s.accent, 0.13 + confidence * 0.18);
      policy.setColorAt(i, s.color);
    }
    policy.instanceMatrix.needsUpdate = true;
    if (policy.instanceColor) policy.instanceColor.needsUpdate = true;

    s.ghostHeading = moving
      ? turnToward(s.ghostHeading, ghostHeading, 1 - Math.exp(-delta * 7))
      : ghostHeading;
    ghost.position.set(
      s.ghostPosition.x,
      0.075 + Math.sin(s.time * 2.2) * 0.032,
      s.ghostPosition.z,
    );
    ghost.rotation.y = s.ghostHeading;
    ghost.scale.setScalar(powered ? 0.94 : 1);
    assets.materials.ghost.color
      .copy(s.paleGrey)
      .lerp(s.white, powered ? 0.42 : 0);

    const successPulse =
      s.outcome === 1 && s.ending > 0
        ? Math.sin(endingProgress * Math.PI)
        : 0;
    goal.scale.setScalar(
      1 + Math.sin(s.time * 1.8) * 0.025 + successPulse * 0.52,
    );
    assets.materials.goalInner.opacity = 0.45 + successPulse * 0.3;
    assets.materials.goalOuter.color
      .copy(s.paleGrey)
      .lerp(s.red, successPulse * 0.7);
  }

  useLayoutEffect(() => {
    const walls = wallsRef.current;
    const footings = footingsRef.current;
    const pellets = pelletsRef.current;
    const trail = trailRef.current;
    const policy = policyRef.current;
    if (!walls || !footings || !pellets || !trail || !policy) return;

    const s = simulation;
    s.time = 0;
    s.episode = 0;
    s.ghostProgress = 3.2;
    s.randomSeed = 0x4f31a2b7;
    s.practiceSeed = 0x17c9e53d;
    resetEpisode(true);

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
    policy.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // Allocate all instance color buffers before the first animation frame.
    for (let i = 0; i < layout.pellets.length; i++) {
      s.color.set(layout.pellets[i].power ? CARDINAL : "#9a9a9a");
      pellets.setColorAt(i, s.color);
      policy.setColorAt(i, s.white);
    }
    for (let i = 0; i < TRAIL_COUNT; i++) {
      trail.setColorAt(i, s.white);
    }

    if (pellets.instanceColor) pellets.instanceColor.needsUpdate = true;
    if (trail.instanceColor) {
      trail.instanceColor.setUsage(THREE.DynamicDrawUsage);
      trail.instanceColor.needsUpdate = true;
    }
    if (policy.instanceColor) {
      policy.instanceColor.setUsage(THREE.DynamicDrawUsage);
      policy.instanceColor.needsUpdate = true;
    }

    updateScene(0, false);
    invalidate();
    // Helpers only close over these stable, memoized resources.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout, assets, simulation, invalidate]);

  useLayoutEffect(() => {
    // Also starts a demand-rendered canvas when animation is resumed.
    // Pausing preserves the exact current frame and all learned values.
    invalidate();
  }, [animate, invalidate]);

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
          ref={policyRef}
          args={[
            assets.geometries.policy,
            assets.materials.policy,
            layout.pellets.length,
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
          <mesh
            ref={burstRef}
            geometry={assets.geometries.burst}
            material={assets.materials.burst}
            position={[0, -0.11, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
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

        <group ref={goalRef} position={[1, 0.025, 7]}>
          <mesh
            geometry={assets.geometries.goalInner}
            material={assets.materials.goalInner}
            rotation={[-Math.PI / 2, 0, 0]}
          />
          <mesh
            geometry={assets.geometries.goalOuter}
            material={assets.materials.goalOuter}
            rotation={[-Math.PI / 2, 0, 0]}
          />
        </group>
      </group>
    </>
  );
}
