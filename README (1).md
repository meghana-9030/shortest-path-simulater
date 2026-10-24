# Shortest Path Simulator

Interactive visualizer comparing **BFS**, **Dijkstra** and **A\*** on a grid.
Built for the DAA (Design and Analysis of Algorithms) project.

## Features
- Draw walls by clicking/dragging, move start and end points
- Choose the algorithm, adjust speed, generate random walls
- Live stats: visited cells, path length, execution time

## How to run
Open `index.html` in any browser. No installation needed.

## Algorithms
| Algorithm | Idea | Time complexity | Guarantees shortest path |
|-----------|------|-----------------|--------------------------|
| BFS | Explores level by level | O(V + E) | Yes (unweighted grid) |
| Dijkstra | Always expands the lowest-cost node | O(V²) here (array), O((V+E) log V) with heap | Yes |
| A* | Dijkstra + Manhattan-distance heuristic | Depends on heuristic, usually explores far fewer cells | Yes (heuristic is admissible) |

## Observation
A* usually visits far fewer cells than BFS/Dijkstra because it is guided toward the goal.

## Tech stack
HTML, CSS, JavaScript

## Author
Medam Meghana Yadav (92400118384), Marwadi University (CSE-AI, ML & DS)
