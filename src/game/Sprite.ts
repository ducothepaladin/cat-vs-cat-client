export class Sprite {
  private image: HTMLImageElement;
  private frameWidth: number;
  private frameHeight: number;
  private currentFrame: number;
  private tickCount: number = 0;
  private ticksPerFrame: number;
  private frameCount: number;
  private col: number;
  private row: number;
  private tileSize: number;
  private maxRow: number;
  private minRow: number;

  // SHADOW values for drawing only
  private shadowFrame: number;
  private shadowRow: number;

  constructor(
    image: HTMLImageElement,
    frameWidth: number,
    frameHeight: number,
    rowCount: number,
    col: number,
    row: number,
    frameCount: number,
    ticksPerFrame: number,
    tileSize: number
  ) {
    this.image = image;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.col = col;
    this.row = row;
    this.frameCount = frameCount;
    this.ticksPerFrame = ticksPerFrame;
    this.currentFrame = col;
    this.tileSize = tileSize;
    this.maxRow = row + rowCount;
    this.minRow = row;

    // Initialize shadow
    this.shadowFrame = this.currentFrame;
    this.shadowRow = this.row;
  }

  update() {
    this.tickCount++;
    if (this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0;
      this.currentFrame++;

      if (this.currentFrame >= this.col + this.frameCount) {
        this.currentFrame = this.col;
        this.row++;
        if (this.row >= this.maxRow) {
          this.currentFrame = this.col;
          this.row = this.minRow;
        }
      }

      // Shadow updates only after full logic cycle
      this.shadowFrame = this.currentFrame;
      this.shadowRow = this.row;
    }
  }

  updateSprite(cF: number, cR: number, fC: number, tPF: number, rC: number) {
    this.col = cF;
    this.row = cR;
    this.frameCount = fC;
    this.ticksPerFrame = tPF;
    this.minRow = cR;
    this.maxRow = cR + rC;
    this.currentFrame = cF;

    // Immediately update shadow too
    this.shadowFrame = this.currentFrame;
    this.shadowRow = this.row;
  }


  draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const sx = this.shadowFrame * this.frameWidth;
    const sy = this.shadowRow * this.frameHeight;

    const drawWidth = this.tileSize * 2;
    const drawHeight = this.tileSize * 2;
    const offsetX = x - drawWidth / 4;
    const offsetY = y - drawHeight / 4;

    ctx.drawImage(
      this.image,
      sx,
      sy,
      this.frameWidth,
      this.frameHeight,
      offsetX,
      offsetY,
      drawWidth,
      drawHeight
    );
  }
}
