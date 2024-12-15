import { convertSecondsToMs, shouldPlayFrame } from "../../../utils";
import { BaseModule, RequiredTimelineModuleProps } from "../../../models";
import { setupModuleUsage } from "../../../utils";
import { BaseConstants } from "../../../constants";

export class MarioGame implements BaseModule {
  static isDev = true;

  private _canvas$!: HTMLCanvasElement;
  private _context!: CanvasRenderingContext2D;
  private _canvasWidth!: number;
  private _canvasHeight!: number;

  private marioX: number = 100;
  private marioY: number;
  private marioWidth: number = 40;
  private marioHeight: number = 60;
  private velocityX: number = 0;
  private velocityY: number = 0;
  private gravity: number = 0.5;
  private isJumping: boolean = false;
  private isDucking: boolean = false;

  private groundY: number;
  private platforms: { x: number, y: number, width: number, height: number }[] = [];
  private enemies: { x: number, y: number, width: number, height: number }[] = [];
  private coins: { x: number, y: number, radius: number }[] = [];
  
  private speed: number = 5;
  private score: number = 0;
  private gameOver: boolean = false;
  private _playing: boolean = false;
  private _leadingAnimationFrame?: number;
  private _prevTimestamp?: number;
  private readonly _durationMs: number;
  private _onComplete?: () => void;

  constructor({ duration }: RequiredTimelineModuleProps) {
    this._durationMs = convertSecondsToMs(duration);
    this._initRenderingComponents();
    this.setupControls();

    this.groundY = this._canvasHeight - 50;
    this.marioY = this.groundY - this.marioHeight;

    // Платформи
    this.platforms = [
      { x: 100, y: this.groundY - 100, width: 200, height: 20 },
      { x: 400, y: this.groundY - 150, width: 150, height: 20 },
      { x: 700, y: this.groundY - 200, width: 100, height: 20 }
    ];

    // Вороги
    this.enemies = [
      { x: 500, y: this.groundY - 40, width: 40, height: 40 }
    ];

    // Монети
    this.coins = [
      { x: 350, y: this.groundY - 160, radius: 10 },
      { x: 750, y: this.groundY - 190, radius: 10 }
    ];
  }

  start() {
    this._canvas$.style.visibility = "visible";
    this._playing = true;
    this._loop();
  }

  stop() {
    return;
  }

  resume() {
    return;
  }

  onDestroy() {
    this._context.clearRect(0, 0, this._canvasWidth, this._canvasHeight);
    cancelAnimationFrame(this._leadingAnimationFrame as number);
    this._canvas$.style.visibility = "none";
  }

  set onComplete(callback: () => void) {
    this._onComplete = callback;
  }

  get duration() {
    return this._durationMs;
  }

  _completeModule() {
    this._context.clearRect(0, 0, this._canvasWidth, this._canvasHeight);
    this._canvas$.style.visibility = "hidden";
    if (this._onComplete) {
      this._onComplete();
    }
  }

  private _loop() {
    if (!this._playing) return;

    if (!this._shouldPlayNextFrame()) {
      this._leadingAnimationFrame = requestAnimationFrame(() => this._loop());
      return;
    }

    if (!this.gameOver) {
      this.renderGame();
    }

    if (this.gameOver) {
      this.showGameOver();
      setTimeout(() => this._completeModule(), 3000);
      return;
    }

    this._leadingAnimationFrame = requestAnimationFrame(() => this._loop());
  }

  private _shouldPlayNextFrame(): boolean {
    if (this._prevTimestamp === undefined) {
      this._prevTimestamp = Date.now();
      return true;
    }

    const frameDelta = Date.now() - this._prevTimestamp;

    if (shouldPlayFrame(frameDelta)) {
      this._prevTimestamp = Date.now();
      return true;
    }

    return false;
  }

  private renderGame(): void {
    this._context.clearRect(0, 0, this._canvasWidth, this._canvasHeight);

    this.updateMario();
    this.updateEnemies();
    this.updateCoins();
    this.checkCollisions();
    this.drawBackground();
    this.drawMario();
    this.drawEnemies();
    this.drawCoins();
    this.drawScore();
  }

  private setupControls(): void {
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" && !this.isJumping && !this.gameOver) {
        this.velocityY = -12;
        this.isJumping = true;
      } else if (e.key === "ArrowRight" && !this.gameOver) {
        this.velocityX = 5;
      } else if (e.key === "ArrowLeft" && !this.gameOver) {
        this.velocityX = -5;
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        this.velocityX = 0;
      }
    });
  }

  private _initRenderingComponents() {
    const canvas$ = document.querySelector<HTMLCanvasElement>(
      `#${BaseConstants.canvasId}`,
    );

    if (canvas$ === null) {
      throw new Error("Canvas element is not defined");
    }

    const context = canvas$.getContext("2d");

    if (context === null) {
      throw new Error("Canvas rendering context is not defined");
    }

    this._canvas$ = canvas$;
    this._context = context;
    this._canvasHeight = canvas$.height;
    this._canvasWidth = canvas$.width;
  }

  private updateMario(): void {
    // Оновлюємо позицію Марио по осі X і Y
    this.marioX += this.velocityX;
    this.marioY += this.velocityY;

    this.velocityY += this.gravity;

    if (this.marioY >= this.groundY - this.marioHeight) {
      this.marioY = this.groundY - this.marioHeight;
      this.isJumping = false;
    }
  }

  private updateEnemies(): void {
    // Вороги рухаються ліворуч
    for (let enemy of this.enemies) {
      enemy.x -= this.speed;
      if (enemy.x < -enemy.width) {
        enemy.x = this._canvasWidth + Math.random() * 100;
      }
    }
  }

  private updateCoins(): void {
    // Монети рухаються ліворуч
    for (let coin of this.coins) {
      coin.x -= this.speed;
      if (coin.x < -coin.radius) {
        coin.x = this._canvasWidth + Math.random() * 200;
      }
    }
  }

  private checkCollisions(): void {
    // Колізія з платформами
    for (let platform of this.platforms) {
      if (
        this.marioX + this.marioWidth > platform.x &&
        this.marioX < platform.x + platform.width &&
        this.marioY + this.marioHeight > platform.y &&
        this.marioY + this.marioHeight <= platform.y + 10
      ) {
        this.velocityY = 0;
        this.marioY = platform.y - this.marioHeight;
        this.isJumping = false;
      }
    }

    // Колізія з ворогами
    for (let enemy of this.enemies) {
      if (
        this.marioX < enemy.x + enemy.width &&
        this.marioX + this.marioWidth > enemy.x &&
        this.marioY < enemy.y + enemy.height &&
        this.marioY + this.marioHeight > enemy.y
      ) {
        this.gameOver = true;
      }
    }

    // Колізія з монетами
    for (let coin of this.coins) {
      if (
        Math.abs(this.marioX + this.marioWidth / 2 - coin.x) < coin.radius &&
        Math.abs(this.marioY + this.marioHeight / 2 - coin.y) < coin.radius
      ) {
        this.score++;
        coin.x = -coin.radius; // Видаляємо монету після збору
      }
    }
  }

  private drawBackground(): void {
    this._context.fillStyle = "#87CEEB";
    this._context.fillRect(0, 0, this._canvasWidth, this._canvasHeight);

    this._context.fillStyle = "#228B22";
    this._context.fillRect(0, this.groundY, this._canvasWidth, 50);

    // Платформи
    for (let platform of this.platforms) {
      this._context.fillStyle = "#8B4513";
      this._context.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
  }

  private drawMario(): void {
    this._context.fillStyle = "#FF0000"; // Червоний для Марио
    this._context.fillRect(this.marioX, this.marioY, this.marioWidth, this.marioHeight);
  }

  private drawEnemies(): void {
    this._context.fillStyle = "#008000"; // Зелений для ворогів
    for (let enemy of this.enemies) {
      this._context.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
  }

  private drawCoins(): void {
    this._context.fillStyle = "#FFD700"; // Золотий для монет
    for (let coin of this.coins) {
      this._context.beginPath();
      this._context.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
      this._context.fill();
    }
  }

  private drawScore(): void {
    this._context.fillStyle = "#000";
    this._context.font = "20px Arial";
    this._context.fillText(`Score: ${this.score}`, 10, 30);
  }

  private showGameOver(): void {
    this._context.fillStyle = "rgba(0, 0, 0, 0.5)";
    this._context.fillRect(0, 0, this._canvasWidth, this._canvasHeight);

    this._context.fillStyle = "#FFF";
    this._context.font = "30px Arial";
    this._context.textAlign = "center";
    this._context.fillText("Game Over!", this._canvasWidth / 2, this._canvasHeight / 2);
    this._context.font = "20px Arial";
    this._context.fillText(`Final Score: ${this.score}`, this._canvasWidth / 2, this._canvasHeight / 2 + 40);
  }
}

setupModuleUsage("MarioGame", MarioGame);