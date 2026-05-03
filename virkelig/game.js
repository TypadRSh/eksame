import DungeonGenerator from "./dungeon.js";
// import Pathfinding from "./pathfinding.js";
import { Player, Enemy } from "./entity.js";

const WIDTH = 200;
const HEIGHT = 100;

class Tile {
  constructor(type = "wall") {
    this.type = type; // "wall" | "floor"
  }

  get char() {
    return this.type === "wall" ? "#" : ".";
  }

  get walkable() {
    return this.type === "floor";
  }
}

class Dungeon {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grid = this._createGrid();

    const gen = new DungeonGenerator(width, height);
    this.rooms = gen.generate();

    this._carveRooms();
  }

  _createGrid() {
    return Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => new Tile("wall"))
    );
  }

  _carveRooms() {
    // super simpel "dungeon": et rektangel i midten
    for (const r of this.rooms) {
      for (let y = r.y; y < r.y + r.h; y++) {
        for (let x = r.x; x < r.x + r.w; x++) {
          this.grid[y][x] = new Tile("floor");
        }
      }
    }
  }

  isInside(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  isWalkable(x, y) {
    return this.isInside(x, y) && this.grid[y][x].walkable;
  }

  getRandomFloor() {
    const floors = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.grid[y][x].type === "floor") {
          floors.push({ x, y });
        }
      }
    }
    return floors[Math.floor(Math.random() * floors.length)];
  }

  draw(entities) {
    const buffer = [];
    for (let y = 0; y < this.height; y++) {
      let line = "";
      for (let x = 0; x < this.width; x++) {
        const entity = entities.find(e => e.x === x && e.y === y);
        if (entity) {
          line += entity.char;
        } else {
          line += this.grid[y][x].char;
        }
      }
      buffer.push(line);
    }
    return buffer.join("\n");
  }
}

class Game {
  constructor() {
    this.dungeon = new Dungeon(WIDTH, HEIGHT);
    
    const playerPos = this.dungeon.getRandomFloor();
    this.player = new Player(playerPos.x, playerPos.y);
    
    this.enemies = [];
    for (let i = 0; i < 3; i++) {
      const pos = this.dungeon.getRandomFloor();
      // Ensure enemy doesn't spawn on player
      if (pos.x !== playerPos.x || pos.y !== playerPos.y) {
        this.enemies.push(new Enemy(pos.x, pos.y));
      }
    }
    
    this.output = document.getElementById("game");
    this._bindInput();
    this.render();
  }

  _bindInput() {
    window.addEventListener("keydown", (e) => {
      let dx = 0, dy = 0;
      if (e.key === "ArrowUp") dy = -1;
      if (e.key === "ArrowDown") dy = 1;
      if (e.key === "ArrowLeft") dx = -1;
      if (e.key === "ArrowRight") dx = 1;
      if (dx !== 0 || dy !== 0) {
        this.playerTurn(dx, dy);
      }
    });
  }

  playerTurn(dx, dy) {
    this.player.tryMove(dx, dy, this.dungeon, this.enemies);
    if (this.player.hp <= 0) {
      alert("Game Over!");
      return;
    }
    // fjern døde fjender
    this.enemies = this.enemies.filter(e => e.hp > 0);
    // fjendernes tur
    for (const enemy of this.enemies) {
      enemy.takeTurn(this.player, this.dungeon, this.enemies);
    }
    this.render();
  }

  render() {
    const entities = [this.player, ...this.enemies];
    this.output.textContent = this.dungeon.draw(entities);
  }
}

new Game();
