import { shouldPlayFrame } from "../../../utils";
import { BaseModule } from "../../../models";
import { setupModuleUsage } from "../../../utils";
import { BaseConstants } from "../../../constants";

export class DinoGame implements BaseModule {
  static isDev = true;

  private _canvas$!: HTMLCanvasElement;
  private _context!: CanvasRenderingContext2D;
  private _canvasWidth!: number;
  private _canvasHeight!: number;

  private dinoX: number = 100;
  private dinoY: number;
  private dinoWidth: number = 40;
  private dinoHeight: number = 40;
  private velocityY: number = 0;
  private gravity: number = 0.5;
  private isJumping: boolean = false;
  private isDucking: boolean = false;

  private groundY: number;
  private cactusX;
  private cactusWidth: number = 30;
  private cactusHeight: number = 50;

  private birdX: number;
  private birdY: number = 320;
  private birdWidth: number = 30;
  private birdHeight: number = 20;

  private speed: number = 5;
  private score: number = 0;
  private gameOver: boolean = false;
  private _playing: boolean = false;
  private _leadingAnimationFrame?: number;
  private _prevTimestamp?: number;
  private _onComplete?: () => void;

  constructor() {
    this._initRenderingComponents();
    this.setupControls();

    this.groundY = this._canvasHeight - 50;
    this.cactusX = this._canvasWidth;
    this.dinoY = this.groundY - this.dinoHeight;

    this.birdX = this._canvasWidth + 200;
    this.birdY = this._canvasHeight / 1.5;
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

  _completeModule() {
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

    this.updateDino();
    this.updateCactus();
    this.updateBird();
    this.increaseSpeed();

    this.checkCollisions();
    this.drawBackground();
    this.drawDino();
    this.drawCactus();
    this.drawBird();

    this.drawScore();
  }

  private setupControls(): void {
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" && !this.isJumping && !this.gameOver) {
        this.velocityY = -12;
        this.isJumping = true;
      } else if (e.key === "ArrowDown" && !this.isJumping && !this.gameOver) {
        this.isDucking = true;
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === "ArrowDown") {
        this.isDucking = false;
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

  private updateDino(): void {
    if (!this.isDucking) {
      this.dinoY += this.velocityY;
      this.velocityY += this.gravity;

      if (this.dinoY >= this.groundY - this.dinoHeight) {
        this.dinoY = this.groundY - this.dinoHeight;
        this.isJumping = false;
      }
    }
  }

  private updateCactus(): void {
    this.cactusX -= this.speed;
    if (this.cactusX < -this.cactusWidth) {
      this.cactusX = this._canvasWidth;
      this.score++;
    }
  }

  private updateBird(): void {
    this.birdX -= this.speed;
    if (this.birdX < -this.birdWidth) {
      this.birdX = 1000;
    }
  }

  private increaseSpeed(): void {
    if (this.score > 0 && this.score % 5 === 0) {
      this.speed += 0.01;
    }
  }

  private checkCollisions(): void {
    if (
      this.dinoX < this.cactusX + this.cactusWidth &&
      this.dinoX + this.dinoWidth > this.cactusX &&
      this.dinoY + this.dinoHeight > this.groundY - this.cactusHeight
    ) {
      this.gameOver = true;
    }

    if (
      this.dinoX < this.birdX + this.birdWidth &&
      this.dinoX + this.dinoWidth > this.birdX &&
      this.dinoY < this.birdY + this.birdHeight &&
      !this.isDucking
    ) {
      this.gameOver = true;
    }
  }

  private drawBackground() {
    this._context.fillStyle = "#87CEEB";
    this._context.fillRect(0, 0, this._canvasWidth, this._canvasHeight);

    this._context.fillStyle = "#FFD700";
    this._context.beginPath();
    this._context.arc(700, 80, 50, 0, Math.PI * 2);
    this._context.fill();

    this._context.fillStyle = "#FFF";
    this._context.beginPath();
    this._context.arc(200, 100, 30, 0, Math.PI * 2);
    this._context.arc(230, 100, 40, 0, Math.PI * 2);
    this._context.arc(260, 100, 30, 0, Math.PI * 2);
    this._context.fill();

    this._context.fillStyle = "#228B22";
    this._context.fillRect(0, this.groundY, this._canvasWidth, 50);
  }

  private drawDino(): void {
    this._context.save();

    if (this.isDucking) {
      this._context.fillStyle = "#556B2F";
      this._context.fillRect(
        this.dinoX,
        this.dinoY + 20,
        this.dinoWidth,
        this.dinoHeight / 2,
      );

      this._context.beginPath();
      this._context.moveTo(this.dinoX - 10, this.dinoY + 30);
      this._context.lineTo(this.dinoX, this.dinoY + 25);
      this._context.lineTo(this.dinoX, this.dinoY + 35);
      this._context.fillStyle = "#556B2F";
      this._context.fill();

      this._context.fillStyle = "#FFF";
      this._context.beginPath();
      this._context.arc(this.dinoX + 30, this.dinoY + 30, 3, 0, Math.PI * 2);
      this._context.fill();
    } else {
      this._context.fillStyle = "#556B2F";
      this._context.fillRect(
        this.dinoX,
        this.dinoY,
        this.dinoWidth,
        this.dinoHeight,
      );

      this._context.beginPath();
      this._context.moveTo(this.dinoX - 10, this.dinoY + 20);
      this._context.lineTo(this.dinoX, this.dinoY + 15);
      this._context.lineTo(this.dinoX, this.dinoY + 25);
      this._context.fillStyle = "#556B2F";
      this._context.fill();

      this._context.fillStyle = "#6B8E23";
      this._context.fillRect(this.dinoX + 5, this.dinoY + 20, 10, 5);

      this._context.fillStyle = "#FFF";
      this._context.beginPath();
      this._context.arc(this.dinoX + 30, this.dinoY + 10, 3, 0, Math.PI * 2);
      this._context.fill();
    }

    this._context.fillStyle = "#8B4513";
    this._context.fillRect(
      this.dinoX + 10,
      this.dinoY + this.dinoHeight - 5,
      10,
      5,
    );
    this._context.fillRect(
      this.dinoX + 25,
      this.dinoY + this.dinoHeight - 5,
      10,
      5,
    );

    this._context.restore();
  }

  private drawBird(): void {
    this._context.save();

    this._context.fillStyle = "#DC143C";
    this._context.beginPath();
    this._context.ellipse(this.birdX, this.birdY, 15, 10, 0, 0, Math.PI * 2);
    this._context.fill();
    this._context.fillStyle = "#FF6347";
    this._context.beginPath();
    this._context.moveTo(this.birdX - 10, this.birdY);
    this._context.lineTo(this.birdX, this.birdY - 15);
    this._context.lineTo(this.birdX + 10, this.birdY);
    this._context.fill();
    this._context.fillStyle = "#FFF";
    this._context.beginPath();
    this._context.arc(this.birdX + 5, this.birdY - 3, 2, 0, Math.PI * 2);
    this._context.fill();

    this._context.restore();
  }

  private drawCactus(): void {
    this._context.fillStyle = "#2E8B57";
    this._context.fillRect(
      this.cactusX,
      this.groundY - this.cactusHeight,
      this.cactusWidth,
      this.cactusHeight,
    );

    // Cactus arms
    this._context.fillRect(
      this.cactusX - 5,
      this.groundY - this.cactusHeight + 10,
      10,
      20,
    );
    this._context.fillRect(
      this.cactusX + this.cactusWidth - 5,
      this.groundY - this.cactusHeight + 10,
      10,
      20,
    );
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
    this._context.fillText(
      "Game Over!",
      this._canvasWidth / 2,
      this._canvasHeight / 2,
    );
    this._context.font = "20px Arial";
    this._context.fillText(
      `Final Score: ${this.score}`,
      this._canvasWidth / 2,
      240,
    );
  }
}

setupModuleUsage("DinoGame", DinoGame);
