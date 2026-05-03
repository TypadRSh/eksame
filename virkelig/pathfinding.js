class Pathfinding {
  static neighbors(x, y) {
    return [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1]
    ];
  }

  // ---------- BFS ----------
  // static bfs(start, goal, dungeon) {
  //   const queue = [[start]];
  //   const visited = new Set([start.x + "," + start.y]);

  //   while (queue.length > 0) {
  //     const path = queue.shift();
  //     const { x, y } = path[path.length - 1];

  //     if (x === goal.x && y === goal.y) return path;

  //     for (const [nx, ny] of this.neighbors(x, y)) {
  //       const key = nx + "," + ny;
  //       if (!visited.has(key) && dungeon.isWalkable(nx, ny)) {
  //         visited.add(key);
  //         queue.push([...path, { x: nx, y: ny }]);
  //       }
  //     }
  //   }

  //   return null;
  // }

  // ---------- A* ----------
  static aStar(start, goal, dungeon) {
    const open = [{ x: start.x, y: start.y, g: 0, f: 0, parent: null }];
    const visited = new Set();

    const h = (x, y) => Math.abs(x - goal.x) + Math.abs(y - goal.y);

    while (open.length > 0) {
      open.sort((a, b) => a.f - b.f);
      const current = open.shift();
      const key = current.x + "," + current.y;

      if (visited.has(key)) continue;
      visited.add(key);

      if (current.x === goal.x && current.y === goal.y) {
        const path = [];
        let node = current;
        while (node) {
          path.push({ x: node.x, y: node.y });
          node = node.parent;
        }
        return path.reverse();
      }

      for (const [nx, ny] of this.neighbors(current.x, current.y)) {
        if (!dungeon.isWalkable(nx, ny)) continue;

        const g = current.g + 1;
        const f = g + h(nx, ny);

        open.push({
          x: nx,
          y: ny,
          g,
          f,
          parent: current
        });
      }
    }

    return null;
  }
}

export default Pathfinding;