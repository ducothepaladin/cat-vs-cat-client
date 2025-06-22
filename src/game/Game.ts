import { Cat } from "./entities/Cat";
import { Renderer } from "./Renderer";
import { InputHandler } from "./Input";
import useMatchStore from "@/store/matchStore";
import backgroundSrc from "../assets/image/cat-vs-cat.png";
import overlapSrc from "../assets/image/cat-vs-cat-overlap-object.png";
import { Camera } from "./Camera";
import { Background } from "./Background";
import { CollisionObjectsSet } from "./Collision";
import { mapCollisions } from "@/assets/data/collisions";
import catSrc from "@/assets/image/black_3.png";
import catSrc2 from "@/assets/image/white_grey_1.png";

const { matchSlot } = useMatchStore.getState();

export class Game {
  public canvas: HTMLCanvasElement;
  public tileSize: number;
  public render: Renderer;
  public input: InputHandler;
  public background: Background;
  public camera: Camera;
  public cat1: Cat;
  public cat2: Cat;
  public collisions: CollisionObjectsSet;
  public overlapObject: Background;
  public userId: string;

  constructor(canvas: HTMLCanvasElement, tileSize: number, userId: string) {
    this.canvas = canvas;
    this.tileSize = tileSize;
    this.userId = userId;

    this.render = new Renderer(canvas);
    this.input = new InputHandler();
    this.background = new Background(backgroundSrc, canvas.width, canvas.height);
    this.overlapObject = new Background(overlapSrc, canvas.width, canvas.height);
    this.collisions = new CollisionObjectsSet(mapCollisions, this.background.width, this.background.height);
    this.camera = new Camera(canvas.width, canvas.height);

    this.cat1 = this.createCat(15, 25, catSrc2, 1, matchSlot[0]?.id === userId);
    this.cat2 = this.createCat(80, 17, catSrc, 0, matchSlot[1]?.id === userId);
  }

  private createCat(
    x: number,
    y: number,
    sprite: string,
    direction: number,
    isCurrentUser: boolean
  ): Cat {
    return new Cat(
      x,
      y,
      "red",
      direction,
      this.input,
      isCurrentUser,
      this.canvas,
      this.camera,
      this.collisions,
      sprite
    );
  }

  stop(): void {
    this.render.stop();
  }

  start(): void {
    this.render.render(
      this.background,
      this.overlapObject,
      this.camera,
      [this.cat1, this.cat2]
    );
  }
}
