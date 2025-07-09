import useStatsStore from "@/store/statsStore";
import type { Background } from "./Background";
import type { Cat } from "./entities/Cat";

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private animationId: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas doesn't support");
    this.ctx = ctx;
  }

  stop() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  render(
    background: Background,
    overlapObject: Background,
    camera: {
      x: number;
      y: number;
      update: (cat: Cat, width: number, height: number) => void;
    },
    cats: Cat[]
  ) {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.imageSmoothingEnabled = false;

    const camX = Math.floor(camera.x);
    const camY = Math.floor(camera.y);

    // Draw background
    this.ctx.save();
    this.ctx.translate(-camX, -camY);
    background.draw(this.ctx);
    this.ctx.restore();

    // Stop if someone died
    const someoneDied = cats.some((cat) => cat.health.isDeath);
    if (someoneDied) {
      this.stop();
    }

    // Update and draw cats
    for (const cat of cats) {
      cat.update();
      cat.drawWithCamera(this.ctx);
    }

    // Draw foreground (overlapObject) ONCE
    this.ctx.save();
    this.ctx.translate(-camX, -camY);
    overlapObject.draw(this.ctx);
    this.ctx.restore();

    // Health, hits, camera logic
    cats.forEach((cat) => {
      if (cat.isPlayer) {
        const enemy = cats.find((c) => !c.isPlayer);
        if (!enemy) return;

        const amount = cat.hit(
          enemy.x,
          enemy.y,
          enemy.health,
          enemy.stats.defense,
          cat.isPlayer
        );

        cat.updateHealth(enemy.health, amount);
        cat.health.draw(this.ctx, cat.x, cat.y, cat.height, {
          x: camera.x,
          y: camera.y,
        });

        camera.update(cat, background.image.width, background.image.height);
      } else {
        const player = cats.find((c) => c.isPlayer);
        if (!player) return;

        cat.hit(
          player.x,
          player.y,
          player.health,
          player.stats.defense,
          cat.isPlayer
        );

        if (cat.isAttack) {
          cat.updateHealth(
            player.health,
            useStatsStore.getState().playerStats.health
          );
        }

        cat.health.draw(this.ctx, cat.x, cat.y, cat.height, {
          x: camera.x,
          y: camera.y,
        });
      }
    });

    // Loop
    if (!someoneDied) {
      this.animationId = requestAnimationFrame(() =>
        this.render(background, overlapObject, camera, cats)
      );
    }
  }
}
