export class Background {
  image: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(imageSrc: string, width: number, height: number) {
    this.image = new Image();
    this.image.src = imageSrc;
    this.image.width = width * 2
    this.image.height = height * 2
    this.x = 0;
    this.y = 0;
    this.width = this.image.width;
    this.height = this.image.height;
  }

  draw(ctx: CanvasRenderingContext2D) {


    if (!this.image) return;

    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
