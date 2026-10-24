const ROWS = 20, COLS = 35;
let start = { r: 10, c: 5 }, end = { r: 10, c: 29 };
let walls = [], cells = [], running = false, mouseDown = false;
const gridEl = document.getElementById('grid');
const $ = id => document.getElementById(id);
const sleep = ms => new Promise(res => setTimeout(res, ms));

// ---------- Build grid ----------
function buildGrid() {
  gridEl.style.gridTemplateColumns = `repeat(${COLS}, auto)`;
  gridEl.innerHTML = '';
  cells = []; walls = [];
  for (let r = 0; r < ROWS; r++) {
    cells.push([]); walls.push([]);
    for (let c = 0; c < COLS; c++) {
      const d = document.createElement('div');
      d.className = 'cell';
      d.addEventListener('mousedown', () => { mouseDown = true; handleCell(r, c); });
      d.addEventListener('mouseenter', () => { if (mouseDown) handleCell(r, c); });
      gridEl.appendChild(d);
      cells[r].push(d); walls[r].push(false);
    }
  }
  paintStartEnd();
}
document.addEventListener('mouseup', () => mouseDown = false);

function paintStartEnd() {
  cells.flat().forEach(el => el.classList.remove('start', 'end'));
  cells[start.r][start.c].classList.add('start');
  cells[end.r][end.c].classList.add('end');
}

function handleCell(r, c) {
  if (running) return;
  const mode = $('mode').value;
  if (mode === 'start' && !walls[r][c]) { start = { r, c }; paintStartEnd(); }
  else if (mode === 'end' && !walls[r][c]) { end = { r, c }; paintStartEnd(); }
  else if (mode === 'wall') {
    if ((r === start.r && c === start.c) || (r === end.r && c === end.c)) return;
    walls[r][c] = !walls[r][c];
    cells[r][c].classList.toggle('wall', walls[r][c]);
  }
}

// ---------- Algorithms (BFS, Dijkstra, A*) ----------
function search(algo) {
  const key = (r, c) => r * COLS + c;
  const h = (r, c) => Math.abs(r - end.r) + Math.abs(c - end.c); // Manhattan distance
  const g = {}, prev = {}, closed = new Set(), visited = [];
  let open = [{ r: start.r, c: start.c }];
  g[key(start.r, start.c)] = 0;

  while (open.length) {
    let idx = 0; // BFS takes the oldest node (queue)
    if (algo !== 'bfs') {
      // Dijkstra: smallest g. A*: smallest g + h
      const f = n => g[key(n.r, n.c)] + (algo === 'astar' ? h(n.r, n.c) : 0);
      for (let i = 1; i < open.length; i++) if (f(open[i]) < f(open[idx])) idx = i;
    }
    const cur = open.splice(idx, 1)[0];
    const k = key(cur.r, cur.c);
    if (closed.has(k)) continue;
    closed.add(k);
    visited.push(cur);

    if (cur.r === end.r && cur.c === end.c) {
      const path = [];
      for (let x = k; x !== undefined; x = prev[x]) path.push({ r: Math.floor(x / COLS), c: x % COLS });
      return { visited, path: path.reverse() };
    }
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = cur.r + dr, nc = cur.c + dc;
      if (nr < 0 || nc < 0 || nr >= ROWS || nc >= COLS || walls[nr][nc]) continue;
      const nk = key(nr, nc);
      if (closed.has(nk)) continue;
      if (!(nk in g) || g[k] + 1 < g[nk]) {
        g[nk] = g[k] + 1; prev[nk] = k;
        open.push({ r: nr, c: nc });
      }
    }
  }
  return { visited, path: [] }; // no path found
}

// ---------- Run + animate ----------
async function run() {
  if (running) return;
  clearPath();
  running = true;
  const t0 = performance.now();
  const { visited, path } = search($('algo').value);
  $('time').textContent = (performance.now() - t0).toFixed(2);
  const delay = () => 55 - $('speed').value;

  let count = 0;
  for (const n of visited) {
    if (!(n.r === start.r && n.c === start.c) && !(n.r === end.r && n.c === end.c))
      cells[n.r][n.c].classList.add('visited');
    $('visited').textContent = ++count;
    await sleep(delay() / 2);
  }
  if (path.length === 0) alert('No path found!');
  for (const n of path) {
    if (!(n.r === start.r && n.c === start.c) && !(n.r === end.r && n.c === end.c))
      cells[n.r][n.c].classList.add('path');
    await sleep(delay());
  }
  $('plen').textContent = path.length ? path.length - 1 : 0;
  running = false;
}

function clearPath() {
  if (running) return;
  cells.flat().forEach(el => el.classList.remove('visited', 'path'));
  $('visited').textContent = 0; $('plen').textContent = 0; $('time').textContent = 0;
}

function randomWalls() {
  if (running) return;
  buildGrid();
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const isSE = (r === start.r && c === start.c) || (r === end.r && c === end.c);
    if (!isSE && Math.random() < 0.28) { walls[r][c] = true; cells[r][c].classList.add('wall'); }
  }
}

$('run').onclick = run;
$('clearPath').onclick = clearPath;
$('maze').onclick = randomWalls;
$('reset').onclick = () => { if (!running) { buildGrid(); clearPath(); } };
buildGrid();
