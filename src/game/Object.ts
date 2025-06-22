export class GameObject {
  public width: number;
  public height: number;
  public x: number;
  public y: number;
  public color: string;

  constructor(x: number, y: number, width: number, height: number, color: string) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
