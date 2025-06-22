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

    this.ctx.save();
    this.ctx.translate(-camX, -camY);
    background.draw(this.ctx);
    this.ctx.restore();

    const someoneDied = cats.some((cat) => cat.health.isDeath);

    if(someoneDied) {
      this.stop();
    }

    for (const cat of cats) {
      cat.update();
      cat.drawWithCamera(this.ctx);
    }

    cats.forEach((cat) => {
      this.ctx.save();
      this.ctx.translate(-camX, -camY);
      overlapObject.draw(this.ctx);
      this.ctx.restore();

      if (cat.isPlayer) {
        const index = cats.findIndex((cat) => !cat.isPlayer);

        const amount = cat.hit(
          cats[index].x,
          cats[index].y,
          cats[index].health,
          cats[index].stats.defense,
          cat.isPlayer
        );
        cat.updateHealth(cats[index].health, amount);
        cat.health.draw(this.ctx, cat.x, cat.y, cat.height, {
          x: camera.x,
          y: camera.y,
        });
        camera.update(cat, background.image.width, background.image.height);
      } else {
        const index = cats.findIndex((cat) => cat.isPlayer);

        cat.hit(
          cats[index].x,
          cats[index].y,
          cats[index].health,
          cats[index].stats.defense,
          cat.isPlayer
        );

        if (cat.isAttack) {
          cat.updateHealth(
            cats[index].health,
            useStatsStore.getState().playerStats.health
          );
        }

        cat.health.draw(this.ctx, cat.x, cat.y, cat.height, {
          x: camera.x,
          y: camera.y,
        });
      }
    });

    if (!someoneDied) {
      this.animationId = requestAnimationFrame(() =>
        this.render(background, overlapObject, camera, cats)
      );

      
    }
  }
}


