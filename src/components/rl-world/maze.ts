/**
 * maze.ts — the shared data model + policy for the RL maze scene.
 *
 * Generates a real maze (recursive-backtracker) on an M×M cell grid, picks a
 * far-apart START and GOAL, and exposes everything the render layers need:
 *   - WALL_SEGMENTS  : proper wall panels on cell edges (for Walls3D)
 *   - dist/policyStep: BFS-optimal policy toward the goal (for the step-arrow trail in Agents.tsx)
 *   - rolloutTimeline: per-agent learning episodes (for the box Agents)
 *
 * Deterministic: a fixed seed drives a mulberry32 PRNG, so the maze is stable
 * across renders (and matches what we screenshot-verify). Cells map to integer
 * world coordinates centered on the origin; walls sit on the ±0.5 edges.
 */

export type Cell = [number, number]; // integer world coords (x, z)
export type Dir = [number, number];

export const M = 11; // cells per side
export const HALF = (M - 1) / 2; // world extent: -HALF..HALF  (=5)
export const DIRS: Dir[] = [[1, 0], [-1, 0], [0, 1], [0, -1]];

export function hash01(n: number): number {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const idx = (ix: number, iz: number) => ix * M + iz;
const cellKey = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);
const toWorld = (i: number): number => i - HALF; // cell index 0..M-1 -> world -HALF..HALF
const toIndex = (w: number): number => Math.round(w + HALF);

// ---- generate the maze (passages between adjacent cells) --------------------
const SEED = 20260831;
const rng = mulberry32(SEED);
const passages = new Set<string>();

(function generate() {
  const visited = new Set<number>();
  const stack: [number, number][] = [[0, 0]];
  visited.add(idx(0, 0));
  while (stack.length) {
    const [ix, iz] = stack[stack.length - 1];
    const nbrs: [number, number][] = [];
    for (const [dx, dz] of DIRS) {
      const nx = ix + dx, nz = iz + dz;
      if (nx >= 0 && nx < M && nz >= 0 && nz < M && !visited.has(idx(nx, nz)))
        nbrs.push([nx, nz]);
    }
    if (!nbrs.length) { stack.pop(); continue; }
    const [nx, nz] = nbrs[Math.floor(rng() * nbrs.length)];
    passages.add(cellKey(idx(ix, iz), idx(nx, nz)));
    visited.add(idx(nx, nz));
    stack.push([nx, nz]);
  }
})();

/** Is there an open passage between two adjacent cells (world coords)? */
export function isOpen(a: Cell, b: Cell): boolean {
  const ia = idx(toIndex(a[0]), toIndex(a[1]));
  const ib = idx(toIndex(b[0]), toIndex(b[1]));
  return passages.has(cellKey(ia, ib));
}

export const inBounds = (x: number, z: number) =>
  x >= -HALF && x <= HALF && z >= -HALF && z <= HALF;

/** Can the agent step from a to an adjacent cell b? (in bounds + open passage) */
export function passable(a: Cell, b: Cell): boolean {
  return inBounds(b[0], b[1]) && isOpen(a, b);
}

// ---- start / goal (far apart, goal biased to the visible right side) --------
function bfsFrom(src: Cell): Map<string, number> {
  const d = new Map<string, number>();
  const k = (x: number, z: number) => `${x},${z}`;
  d.set(k(src[0], src[1]), 0);
  let frontier: Cell[] = [src];
  while (frontier.length) {
    const next: Cell[] = [];
    for (const c of frontier) {
      const base = d.get(k(c[0], c[1]))!;
      for (const [dx, dz] of DIRS) {
        const nb: Cell = [c[0] + dx, c[1] + dz];
        if (!passable(c, nb)) continue;
        const kk = k(nb[0], nb[1]);
        if (!d.has(kk)) { d.set(kk, base + 1); next.push(nb); }
      }
    }
    frontier = next;
  }
  return d;
}

export const START: Cell = [-HALF, HALF]; // bottom-left cell
const distFromStart = bfsFrom(START);
export const GOAL: Cell = (() => {
  let best: Cell = [HALF, -HALF];
  let bestScore = -Infinity;
  for (let ix = 0; ix < M; ix++)
    for (let iz = 0; iz < M; iz++) {
      const c: Cell = [toWorld(ix), toWorld(iz)];
      const d = distFromStart.get(`${c[0]},${c[1]}`);
      if (d === undefined) continue;
      // prefer long paths that end on the visible right side
      const score = d + (c[0] > 0 ? c[0] * 1.5 : 0);
      if (score > bestScore) { bestScore = score; best = c; }
    }
  return best;
})();

// ---- optimal policy: BFS distance to goal -----------------------------------
const distToGoal = bfsFrom(GOAL);
export function dist(c: Cell): number {
  return distToGoal.get(`${c[0]},${c[1]}`) ?? Infinity;
}
/** Optimal greedy action from a cell: the open neighbor closest to the goal. */
export function policyStep(c: Cell): Dir {
  let best: Dir = [0, 0];
  let bestD = dist(c);
  for (const [dx, dz] of DIRS) {
    const nb: Cell = [c[0] + dx, c[1] + dz];
    if (!passable(c, nb)) continue;
    const nd = dist(nb);
    if (nd < bestD) { bestD = nd; best = [dx, dz]; }
  }
  return best;
}
// ---- wall panels on cell edges (interior closed edges + outer boundary) -----
export type WallSeg = { x: number; z: number; axis: "x" | "z" };
// axis 'x' => wall blocks x-movement, panel runs along z (a north-south wall)
// axis 'z' => wall blocks z-movement, panel runs along x (an east-west wall)
export const WALL_SEGMENTS: WallSeg[] = (() => {
  const segs: WallSeg[] = [];
  for (let ix = 0; ix < M; ix++)
    for (let iz = 0; iz < M; iz++) {
      const c: Cell = [toWorld(ix), toWorld(iz)];
      // east edge (between this cell and x+1)
      const east: Cell = [c[0] + 1, c[1]];
      if (!inBounds(east[0], east[1])) {
        segs.push({ x: c[0] + 0.5, z: c[1], axis: "x" }); // outer boundary
      } else if (!isOpen(c, east)) {
        if (c[0] < east[0]) segs.push({ x: c[0] + 0.5, z: c[1], axis: "x" });
      }
      // north edge (between this cell and z+1)
      const north: Cell = [c[0], c[1] + 1];
      if (!inBounds(north[0], north[1])) {
        segs.push({ x: c[0], z: c[1] + 0.5, axis: "z" });
      } else if (!isOpen(c, north)) {
        if (c[1] < north[1]) segs.push({ x: c[0], z: c[1] + 0.5, axis: "z" });
      }
      // also close the far-west / far-south outer boundary
      if (ix === 0) segs.push({ x: c[0] - 0.5, z: c[1], axis: "x" });
      if (iz === 0) segs.push({ x: c[0], z: c[1] - 0.5, axis: "z" });
    }
  return segs;
})();

// ---- per-agent learning timeline (episodes, exploration -> exploitation) ----
export type Frame = { cell: Cell; ep: number; bump: boolean; dir: Dir; goal: boolean };
export const EPISODES = 5;
const PAUSE = 3;

export function rolloutTimeline(agentSeed: number, start: Cell): Frame[] {
  const frames: Frame[] = [];
  for (let e = 0; e < EPISODES; e++) {
    const epsilon = 0.6 * (1 - e / (EPISODES - 1));
    let cur: Cell = [start[0], start[1]];
    frames.push({ cell: [cur[0], cur[1]], ep: e, bump: false, dir: [0, 0], goal: false });
    let steps = 0;
    const maxSteps = 160;
    while (!(cur[0] === GOAL[0] && cur[1] === GOAL[1]) && steps < maxSteps) {
      const seed = agentSeed * 1e5 + e * 1e3 + steps;
      const explore = hash01(seed) < epsilon;
      const dir = explore ? DIRS[Math.floor(hash01(seed + 0.37) * 4) % 4] : policyStep(cur);
      const nb: Cell = [cur[0] + dir[0], cur[1] + dir[1]];
      if (!passable(cur, nb)) {
        frames.push({ cell: [cur[0], cur[1]], ep: e, bump: true, dir, goal: false });
      } else {
        cur = nb;
        const atGoal = cur[0] === GOAL[0] && cur[1] === GOAL[1];
        frames.push({ cell: [cur[0], cur[1]], ep: e, bump: false, dir, goal: atGoal });
      }
      steps++;
    }
    for (let p = 0; p < PAUSE; p++)
      frames.push({ cell: [cur[0], cur[1]], ep: e, bump: false, dir: [0, 0], goal: true });
  }
  return frames;
}
