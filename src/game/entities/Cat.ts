import { socket } from "@/api/socket";
import type { InputHandler } from "../Input";
import { GameObject } from "../Object";
import { Health } from "../value-object/Health";
import type { PlayerInput, Position } from "@/types/Match";
import useMatchStore from "@/store/matchStore";
import type { Camera } from "../Camera";
import { Collision, CollisionObjectsSet } from "../Collision";
import { Sprite } from "../Sprite";
import { Stats } from "../value-object/Stats";
import effectSrc from "@/assets/image/effects.png";

type FacedLocation = "L" | "R" | "T" | "B" | "LT" | "LB" | "RT" | "RB";

export class Cat extends GameObject {
  private velocity = { x: 0, y: 0 };
  private speed: number;
  private input: InputHandler;
  public isPlayer: boolean;
  private facedLocation: FacedLocation = "L";
  private facingHitboxSize: { width: number; height: number };
  public isAttack = false;
  public health: Health;
  private camera: Camera;
  private collisions: CollisionObjectsSet;
  private collisionBlocks: Collision[];
  private catImage: HTMLImageElement;
  private catSprite: Sprite;
  private lastFaced = "";
  public stats: Stats;
  private lastHitTime: number;
  private effectSprite: Sprite;
  private effectActive: boolean;
  private effectStartTime: number;
  private effectDuration: number;
  private lastInput: PlayerInput;
  private remoteIndex: number;
  private positionLastUpdate: number;
  private positonLocalLastUpdate: number;
  private canvas: HTMLCanvasElement;
  private lastPositionUpdate: Position;

  constructor(
    col: number,
    row: number,
    color: string,
    remoteIndex: number,
    input: InputHandler,
    isPlayer: boolean,
    canvas: HTMLCanvasElement,
    camera: Camera,
    collisions: CollisionObjectsSet,
    imageSrc: string
  ) {
    const tileWidth = (canvas.width / 96) * 2;
    const tileHeight = (canvas.height / 48) * 2;

    const position = useMatchStore.getState().position;
    const pPosition = useMatchStore.getState().pPosition;

    const x = isPlayer
      ? pPosition
        ? Number((pPosition.x * canvas.width).toFixed(4))
        : tileWidth * col
      : position
      ? position.x
      : tileWidth * col;
    const y = isPlayer
      ? pPosition
        ? Number((pPosition.y * canvas.height).toFixed(4))
        : tileHeight * row
      : position
      ? position.y
      : tileHeight * row;

    super(x, y, 28, 28, color);
    this.canvas = canvas;
    this.input = input;
    this.speed = tileWidth / 8;
    this.isPlayer = isPlayer;
    this.width = tileWidth;
    this.height = tileHeight;
    this.facingHitboxSize = {
      width: (tileWidth / 2) * 3,
      height: (tileHeight / 2) * 3,
    };
    this.lastInput = {
      up: false,
      down: false,
      left: false,
      right: false,
      attack: false,
    };
    this.remoteIndex = remoteIndex;

    this.health = new Health(this.x, this.y, 100, 6);
    this.stats = new Stats(50, 20, 0.1);
    this.isAttack = false;
    this.lastHitTime = 0;
    const effectImage = new Image();
    effectImage.src = effectSrc;
    this.effectSprite = new Sprite(
      effectImage,
      64,
      64,
      10,
      1,
      3,
      1,
      2,
      2,
      this.width
    );
    this.effectActive = false;
    this.effectStartTime = 0;
    this.effectDuration = 100;

    this.camera = camera;
    this.collisions = collisions;
    this.collisionBlocks = this.collisions.createCollisionObjects();

    this.catImage = new Image();
    this.catImage.src = imageSrc;
    this.catSprite = new Sprite(
      this.catImage,
      32,
      32,
      4,
      2,
      1,
      7,
      6,
      2,
      this.width
    );

    this.positionLastUpdate = Date.now();
    this.positonLocalLastUpdate = Date.now();
    this.lastPositionUpdate = useMatchStore.getState().position ?? {
      x: 0,
      y: 0,
    };
  }

  update(): void {
    this.changeSprite();
    if (this.isPlayer) {
      this.handleInput(this.getPlayerInput());
      this.playerAction(this.getPlayerInput());
      this.remotePositionUpdate();
      this.updateLocalPositon();
      this.checkLose();
    } else {
      this.handleInput(this.getRemotePlayerInput());
      this.updateRemotePosition();

    }
    this.applyMovement();
    this.checkCollisions();
  }

  private handleInput(data: PlayerInput): void {
    let dx = 0,
      dy = 0;
    if (data.left) dx -= 1;
    if (data.right) dx += 1;
    if (data.up) dy -= 1;
    if (data.down) dy += 1;

    this.isAttack = data.attack;

    this.facedLocation = this.getFacedLocation(dx, dy);

    const length = Math.hypot(dx, dy);
    if (length > 0) {
      dx /= length;
      dy /= length;
    }
    this.velocity.x = dx * this.speed;
    this.velocity.y = dy * this.speed;
  }

  isInputEqual(newInput: PlayerInput, lastInput: PlayerInput) {
    return (
      newInput.up === lastInput.up &&
      newInput.down === lastInput.down &&
      newInput.left === lastInput.left &&
      newInput.right === lastInput.right &&
      newInput.attack === lastInput.attack
    );
  }

  getRemotePlayerInput() {
    const data = useMatchStore.getState().playerInput;
    return data;
  }

  getPlayerInput() {
    const data: PlayerInput = {
      up: this.input.isPressed("w"),
      down: this.input.isPressed("s"),
      left: this.input.isPressed("a"),
      right: this.input.isPressed("d"),
      attack: this.input.isPressed("h"),
    };

    return data;
  }

  private getFacedLocation(dx: number, dy: number): FacedLocation {
    if (dx === -1 && dy === -1) return "LT";
    if (dx === -1 && dy === 1) return "LB";
    if (dx === 1 && dy === -1) return "RT";
    if (dx === 1 && dy === 1) return "RB";
    if (dx === -1) return "L";
    if (dx === 1) return "R";
    if (dy === -1) return "T";
    if (dy === 1) return "B";
    return this.facedLocation;
  }

  private checkCollisions(): void {
    for (const block of this.collisionBlocks) {
      if (
        this.x + this.width > block.x &&
        this.x < block.x + block.width &&
        this.y + this.height > block.y &&
        this.y < block.y + block.height
      ) {
        const overlapX1 = this.x + this.width - block.x;
        const overlapX2 = block.x + block.width - this.x;
        const overlapY1 = this.y + this.height - block.y;
        const overlapY2 = block.y + block.height - this.y;
        const minOverlapX = overlapX1 < overlapX2 ? overlapX1 : -overlapX2;
        const minOverlapY = overlapY1 < overlapY2 ? overlapY1 : -overlapY2;

        if (Math.abs(minOverlapX) < Math.abs(minOverlapY)) {
          this.x -= minOverlapX;
          this.velocity.x = 0;
        } else {
          this.y -= minOverlapY;
          this.velocity.y = 0;
        }
      }
    }
  }

  private applyMovement(): void {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  getFacingHitbox(): { x: number; y: number; width: number; height: number } {
    const { width, height } = this.facingHitboxSize;
    let x = this.x,
      y = this.y;
    switch (this.facedLocation) {
      case "L":
        x -= width;
        y += this.height / 2 - height / 2;
        break;
      case "R":
        x += this.width;
        y += this.height / 2 - height / 2;
        break;
      case "T":
        x += this.width / 2 - width / 2;
        y -= height;
        break;
      case "B":
        x += this.width / 2 - width / 2;
        y += this.height;
        break;
      case "LT":
        x -= width;
        y -= height;
        break;
      case "LB":
        x -= width;
        y += this.height;
        break;
      case "RT":
        x += this.width;
        y -= height;
        break;
      case "RB":
        x += this.width;
        y += this.height;
        break;
    }
    return { x, y, width, height };
  }

  private changeSprite() {
    if (this.lastFaced === this.facedLocation) return;
    this.lastFaced = this.facedLocation;
    const spriteMap: Record<
      FacedLocation,
      [number, number, number, number, number]
    > = {
      L: [17, 5, 6, 4, 1],
      R: [17, 13, 6, 4, 1],
      T: [17, 9, 6, 4, 1],
      B: [17, 1, 6, 4, 1],
      LT: [17, 7, 6, 4, 1],
      RT: [17, 11, 6, 4, 1],
      RB: [17, 15, 6, 4, 1],
      LB: [17, 3, 6, 4, 1],
    };
    const [frames, row, count, tick, currentRow] = spriteMap[this.facedLocation]
      ? spriteMap[this.facedLocation]
      : [1, 1, 12, 12, 2];
    this.catSprite.updateSprite(frames, row, count, tick, currentRow);
  }

  hit(x: number, y: number, health: Health, def: number, isPlayer: boolean) {
    const hb = this.getFacingHitbox();
    const now = Date.now();
    let amount = health.current;

    const isHit =
      hb.x < x + this.width &&
      hb.x + hb.width > x &&
      hb.y < y + this.height &&
      hb.y + hb.height > y;

    const hitCooldown = 200;

    if (this.isAttack && now - this.lastHitTime > hitCooldown) {
      this.lastHitTime = now;

      const damage = this.stats.damgae(def);

      if (isHit) {
        const remoteId =
          useMatchStore.getState().matchSlot[this.remoteIndex].id;

        const updateHealth = health.tookDamage(damage);
        isPlayer && socket.emit("hit", { remoteId, updateHealth });
        amount = updateHealth;
      }

      this.effectActive = true;
      this.effectStartTime = now;
    }
    return amount;
  }

  updateHealth(health: Health, amount: number) {
    if (health.isDeath) return;
    health.setHealth(amount);
    if (health.current <= 0) {
      health.isDeath = true;
      useMatchStore.getState().setIsWin("win");
    }
  }

  checkLose() {
    if (this.health.isDeath) {
      useMatchStore.getState().setIsWin("lose");
    }
  }

  drawFacingHitbox(ctx: CanvasRenderingContext2D) {
    const hb = this.getFacingHitbox();
    const drawX = hb.x - this.camera.x;
    const drawY = hb.y - this.camera.y;
    ctx.strokeStyle = "orange";
    ctx.fillStyle = "black";
    ctx.strokeRect(drawX, drawY, hb.width, hb.height);
    ctx.fillRect(drawX, drawY, hb.width, hb.height);
  }

  updateRemotePosition() {
    const newPosition: Position = useMatchStore.getState().position ?? {
      x: 0,
      y: 0,
    };

    if (newPosition !== this.lastPositionUpdate) {
      const px = (newPosition.x * this.canvas.width).toFixed(4);
      const py = (newPosition.y * this.canvas.height).toFixed(4);

      this.x = Number(px);
      this.y = Number(py);

      this.lastPositionUpdate = newPosition;
    }
  }

  updateLocalPositon() {
    const now = Date.now();
    const delay = 1000;

    const px = (this.x / this.canvas.width).toFixed(4);
    const py = (this.y / this.canvas.height).toFixed(4);

    if (now - this.positonLocalLastUpdate > delay) {
      useMatchStore.getState().setPPosition({ x: Number(px), y: Number(py) });

      this.positonLocalLastUpdate = now;
    }
  }

  remotePositionUpdate() {
    const now = Date.now();
    const delay = 1000;

    const px = (this.x / this.canvas.width).toFixed(4);
    const py = (this.y / this.canvas.height).toFixed(4);

    if (now - this.positionLastUpdate > delay) {
      const remoteId = useMatchStore.getState().matchSlot[this.remoteIndex].id;

      socket.emit("update_position", { remoteId, position: { x: px, y: py } });

      this.positionLastUpdate = now;
    }
  }

  playerAction(input: PlayerInput) {
    const newInput = input;

    if (!this.isInputEqual(newInput, this.lastInput)) {
      const userId = useMatchStore.getState().matchSlot[this.remoteIndex].id;
      socket.emit("player_action", { userId, input: newInput });
      this.lastInput = { ...newInput };
    }
  }

  drawWithCamera(ctx: CanvasRenderingContext2D) {
    const drawX = this.x - this.camera.x;
    const drawY = this.y - this.camera.y;

    const hb = this.getFacingHitbox();

    // ctx.fillStyle = this.color;
    // ctx.fillRect(drawX, drawY, this.width, this.height);

    // this.collisions.draw(ctx, this.camera.x, this.camera.y);

    this.catSprite.update();
    this.catSprite.draw(ctx, drawX, drawY);

    if (this.effectActive) {
      const elapsed = Date.now() - this.effectStartTime;

      this.effectSprite.update();
      this.effectSprite.draw(ctx, hb.x - this.camera.x, hb.y - this.camera.y);

      if (elapsed > this.effectDuration) {
        this.effectActive = false;
      }
    }
  }
}
