import useStatsStore from "@/store/statsStore";

export class Health {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public current: number;
  public max: number;
  public isDeath: boolean;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    const max = useStatsStore.getState().playerStats.health;
    
    this.max = 1000;
    this.current = max;
    this.isDeath = false;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    px: number,
    py: number,
    height: number,
    camera: { x: number; y: number }
  ) {
    // Adjust position based on camera
    const screenX = px - camera.x;
    const screenY = py - camera.y;

    this.x = screenX;
    this.y = screenY;

    const barWidth = this.width;
    const barHeight = this.height;

    const x = this.x;
    const y = this.y - (height + this.height);

    const percentage = this.current / this.max;
    const filledWidth = barWidth * percentage;

    ctx.fillStyle = "gray";
    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.fillStyle =
      percentage > 0.6 ? "green" : percentage > 0.3 ? "orange" : "red";
    ctx.fillRect(x, y, filledWidth, barHeight);

    ctx.strokeStyle = "black";
    ctx.strokeRect(x, y, barWidth, barHeight);
  }

  setHealth(amount: number) {
    this.current = amount;
  }

  tookDamage(dmg: number) {
  
    return this.current <= 0 ? 0 : this.current - dmg;
  }
}
