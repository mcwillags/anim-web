import { convertSecondsToMs, shouldPlayFrame } from "../../../utils";
import { BaseModule, RequiredTimelineModuleProps } from "../../../models";
import { setupModuleUsage } from "../../../utils";
import { BaseConstants } from "../../../constants";

export class SnakesGame implements BaseModule {
  static isDev = true;

  private _canvas$!: HTMLCanvasElement;
  private _context!: CanvasRenderingContext2D;
  private _canvasWidth!: number;
  private _canvasHeight!: number;

  private snake: { x: number, y: number }[] = [
    { x: 50, y: 50 },
    { x: 40, y: 50 },
    { x: 30, y: 50 },
  ]; // Початкові координати змійки
  private direction: string = "RIGHT"; // Напрямок руху змійки
  private food: { x: number, y: number } = { x: 0, y: 0 }; // Початкова їжа
  private score: number = 0;
  private gameOver: boolean = false;
  private speed: number = 9;
  private _playing: boolean = false;
  private _leadingAnimationFrame?: number;
  private _prevTimestamp?: number;
  private readonly _durationMs: number;
  private _onComplete?: () => void;

  constructor({ duration }: RequiredTimelineModuleProps) {
    this._durationMs = convertSecondsToMs(duration);
    this._initRenderingComponents();
    this.setupControls();
    this.food = this.generateFood(); // Ініціалізація їжі
  }

  start() {
    this._canvas$.style.visibility = "visible";
    this._playing = true;
    this._loop();
  }

  stop() {
    this._playing = false;
  }

  resume() {
    this._playing = true;
    this._loop();
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
    } else {
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

    if (frameDelta >= 1000 / this.speed) { // Врахування швидкості
      this._prevTimestamp = Date.now();
      return true;
    }

    return false;
  }

  private renderGame(): void {
    this._context.clearRect(0, 0, this._canvasWidth, this._canvasHeight);

    this.updateSnake();
    this.checkCollisions();
    this.drawBackground();
    this.drawSnake();
    this.drawFood();
    this.drawScore();
  }

  private setupControls(): void {
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" && this.direction !== "DOWN") {
        this.direction = "UP";
      } else if (e.key === "ArrowDown" && this.direction !== "UP") {
        this.direction = "DOWN";
      } else if (e.key === "ArrowLeft" && this.direction !== "RIGHT") {
        this.direction = "LEFT";
      } else if (e.key === "ArrowRight" && this.direction !== "LEFT") {
        this.direction = "RIGHT";
      }
    });
  }

  private _initRenderingComponents() {
    const canvas$ = document.querySelector<HTMLCanvasElement>(
      `#${BaseConstants.canvasId}`
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

  private updateSnake(): void {
    let head = { ...this.snake[0] };

    if (this.direction === "UP") head.y -= 10;
    else if (this.direction === "DOWN") head.y += 10;
    else if (this.direction === "LEFT") head.x -= 10;
    else if (this.direction === "RIGHT") head.x += 10;

    this.snake.unshift(head);

    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      this.food = this.generateFood();
    } else {
      this.snake.pop();
    }
  }

  private checkCollisions(): void {
    const head = this.snake[0];

    // Перевірка зіткнення зі стінами
    if (
      head.x < 0 ||
      head.x >= this._canvasWidth ||
      head.y < 0 ||
      head.y >= this._canvasHeight
    ) {
      this.gameOver = true;
    }

    // Перевірка зіткнення з тілом
    for (let i = 1; i < this.snake.length; i++) {
      if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
        this.gameOver = true;
      }
    }
  }

  private generateFood(): { x: number; y: number } {
    let foodX, foodY;
    do {
      foodX = Math.floor(Math.random() * (this._canvasWidth / 10)) * 10;
      foodY = Math.floor(Math.random() * (this._canvasHeight / 10)) * 10;
    } while (this.snake.some(segment => segment.x === foodX && segment.y === foodY));

    return { x: foodX, y: foodY };
  }

  private drawBackground(): void {
    this._context.fillStyle = "#F0F0F0";
    this._context.fillRect(0, 0, this._canvasWidth, this._canvasHeight);
  }

  private drawSnake(): void {
    this._context.fillStyle = "#008000";
    for (let segment of this.snake) {
      this._context.fillRect(segment.x, segment.y, 10, 10);
    }
  }

  private drawFood(): void {
    this._context.fillStyle = "#FF0000";
    this._context.fillRect(this.food.x, this.food.y, 10, 10);
  }

  private drawScore(): void {
    this._context.fillStyle = "#000000";
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
    this._context.fillText(`Final Score: ${this.score}`, this._canvasWidth / 2, this._canvasHeight / 2 + 40);
  }
}


setupModuleUsage("SnakesGame", SnakesGame);