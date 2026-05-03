import Pathfinding from "./pathfinding.js";  

class Entity {
    constructor(x, y, char, hp) {
        this.x = x;
        this.y = y;
        this.char = char;
        this.hp = hp;
    }

    tryMove(dx, dy, dungeon, others) {
        const nx = this.x + dx;
        const ny = this.y + dy;

        // kolliderer med anden entity?
        const target = others.find(e => e.x === nx && e.y === ny);
        if (target) {
            // meget simpel "kamp"
            target.hp -= 1;
            console.log(`${this.char} hits ${target.char}, hp=${target.hp}`);
            return;
        }

        if (dungeon.isWalkable(nx, ny)) {
            this.x = nx;
            this.y = ny;
        }
    }
}

class Player extends Entity {
    constructor(x, y) {
        super(x, y, "@", 20); // x pos, y pos, tegn tingen er og hit points
      
    }
}

class Enemy extends Entity {
    constructor(x, y) {
        super(x, y, "E", 5); // det samme som player
  
    }
    takeTurn(player, dungeon, others) {
        const path = Pathfinding.aStar(
            { x: this.x, y: this.y },
            { x: player.x, y: player.y },
            dungeon
        );

        if (path && path.length > 1) {
            const next = path[1];
            this.tryMove(next.x - this.x, next.y - this.y, dungeon, [player, ...others]);
        }
    }
}



    export { Entity, Player, Enemy };