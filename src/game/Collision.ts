

export class Collision {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

export class CollisionObjectsSet {
  tile: number;
  detectArr: number[];
  width: number;
  height: number;

  constructor(detectArr: number[], width: number, height: number) {
    this.tile = width / 96;
    this.detectArr = detectArr;
    this.width = width;
    this.height = height;
  }

  parse2D(): number[][] {
    const col = 96;
    const rows = [];
    for (let i = 0; i < this.detectArr.length; i += col) {
      rows.push(this.detectArr.slice(i, i + col));
    }
    return rows;
  }

  createCollisionObjects():Collision[] {
    const objects: Collision[] = [];
    this.parse2D().forEach((row, y1) => {
      row.forEach((block, x1) => {
        if (block == 1265) {
          objects.push(new Collision(x1 * this.tile,y1 * this.tile, this.tile, this.tile ));
        }
      });

    });

    return objects;
  }

draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
  const collisions = this.createCollisionObjects();
  ctx.save();
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;

  collisions.forEach(obj => {
    ctx.strokeRect(obj.x - cameraX, obj.y - cameraY, obj.width, obj.height);
  });

  ctx.restore();
}
}
