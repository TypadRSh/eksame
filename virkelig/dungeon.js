class DungeonGenerator {
  constructor(width, height, minRoomSize = 5, maxDepth = 4) {
    this.width = width;
    this.height = height;
    this.minRoomSize = minRoomSize;
    this.maxDepth = maxDepth;
    this.rooms = [];
  }

  generate() {
    const root = {
      x: 1,
      y: 1,
      w: this.width - 2,
      h: this.height - 2,
      depth: 0
    };

    const leaves = this.split(root);
    leaves.forEach(leaf => {
      const room = this.createRoom(leaf);
      leaf.room = room;
      this.rooms.push(room);
    });

    this.connectRooms(leaves);

    return this.rooms;
  }

  split(node) {
    const leaves = [node];

    let didSplit = true;
    while (didSplit) {
      didSplit = false;
      for (let i = 0; i < leaves.length; i++) {
        const leaf = leaves[i];

        if (leaf.depth >= this.maxDepth) continue;

        const splitH = Math.random() < 0.5;
        const max = (splitH ? leaf.h : leaf.w) - this.minRoomSize * 2;

        if (max <= this.minRoomSize) continue;

        const split = Math.floor(Math.random() * (max - this.minRoomSize)) + this.minRoomSize;

        const leaf1 = {
          x: leaf.x,
          y: leaf.y,
          w: splitH ? leaf.w : split,
          h: splitH ? split : leaf.h,
          depth: leaf.depth + 1
        };

        const leaf2 = {
          x: splitH ? leaf.x : leaf.x + split,
          y: splitH ? leaf.y + split : leaf.y,
          w: splitH ? leaf.w : leaf.w - split,
          h: splitH ? leaf.h - split : leaf.h,
          depth: leaf.depth + 1
        };

        leaves.splice(i, 1, leaf1, leaf2);
        didSplit = true;
        break;
      }
    }

    return leaves;
  }

  createRoom(leaf) {
    const roomW = Math.floor(Math.random() * (leaf.w - 4)) + 4;
    const roomH = Math.floor(Math.random() * (leaf.h - 4)) + 4;

    const roomX = leaf.x + Math.floor(Math.random() * (leaf.w - roomW));
    const roomY = leaf.y + Math.floor(Math.random() * (leaf.h - roomH));

    return { x: roomX, y: roomY, w: roomW, h: roomH };
  }

  connectRooms(leaves) {
    for (let i = 1; i < leaves.length; i++) {
      const roomA = leaves[i - 1].room;
      const roomB = leaves[i].room;

      const ax = Math.floor(roomA.x + roomA.w / 2);
      const ay = Math.floor(roomA.y + roomA.h / 2);

      const bx = Math.floor(roomB.x + roomB.w / 2);
      const by = Math.floor(roomB.y + roomB.h / 2);

      if (Math.random() < 0.5) {
        this.carveCorridor(ax, ay, bx, ay);
        this.carveCorridor(bx, ay, bx, by);
      } else {
        this.carveCorridor(ax, ay, ax, by);
        this.carveCorridor(ax, by, bx, by);
      }
    }
  }

  carveCorridor(x1, y1, x2, y2) {
    this.rooms.push({ x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x1 - x2) + 1, h: Math.abs(y1 - y2) + 1 });
  }
}
export default DungeonGenerator;