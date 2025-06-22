import { Cat } from "./entities/Cat";

export class Camera {
  x = 0;
  y = 0;
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  update(player: Cat, bgWidth: number, bgHeight: number) {
    const halfCamW = this.width / 2;
    const halfCamH = this.height / 2;

    // Center the camera on the player's center
    this.x = player.x + player.width / 2 - halfCamW;
    this.y = player.y + player.height / 2 - halfCamH;

    // Clamp camera within background bounds
    this.x = Math.max(0, Math.min(this.x, bgWidth - this.width));
    this.y = Math.max(0, Math.min(this.y, bgHeight - this.height));
  }
}
