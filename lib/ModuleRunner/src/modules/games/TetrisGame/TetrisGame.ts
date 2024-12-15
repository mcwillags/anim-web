import { convertSecondsToMs } from "../../../utils";
import { BaseModule, RequiredTimelineModuleProps } from "../../../models";
import { setupModuleUsage } from "../../../utils";
import { BaseConstants } from "../../../constants";

export class TetrisGame implements BaseModule {
  static isDev = true;

  private _canvas$!: HTMLCanvasElement;
  private _context!: CanvasRenderingContext2D;
  private _canvasWidth!: number;
  private _canvasHeight!: number;

  private grid: number[][] = [];
  private activeTetromino: { shape: number[][]; x: number; y: number };
  private nextTetromino: { shape: number[][] };
  private score: number = 0;
  private gameOver: boolean = false;
  private speed: number = 500;
  private _playing: boolean = false;
  private _leadingTimeout?: number;
  private readonly _durationMs: number;
  private _onComplete?: () => void;

  constructor({ duration }: RequiredTimelineModuleProps) {
    this._durationMs = convertSecondsToMs(duration);
    this._initRenderingComponents();
    this.setupControls();
    this.initializeGrid();
    this.activeTetromino = this.generateTetromino();
    this.nextTetromino = this.generateTetromino();
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
    clearTimeout(this._leadingTimeout);
    this._context.clearRect(0, 0, this._canvasWidth, this._canvasHeight);
    this._canvas$.style.visibility = "none";
  }

  set onComplete(callback: () => void) {
    this._onComplete = callback;
  }

  get duration() {
    return this._durationMs;
  }

  private _loop() {
    if (!this._playing || this.gameOver) return;

    this.updateGame();
    this.renderGame();

    this._leadingTimeout = window.setTimeout(() => this._loop(), this.speed);
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

  private setupControls() {
    window.addEventListener("keydown", (e) => {
      if (this.gameOver) return;

      if (e.key === "ArrowLeft") {
        this.moveTetromino(-1);
      } else if (e.key === "ArrowRight") {
        this.moveTetromino(1);
      } else if (e.key === "ArrowDown") {
        this.dropTetromino();
      } else if (e.key === "ArrowUp") {
        this.rotateTetromino();
      }
    });
  }

  private initializeGrid() {
    const rows = this._canvasHeight / 20;
    const cols = this._canvasWidth / 20;

    this.grid = Array.from({ length: rows }, () => Array(cols).fill(0));
  }

  private generateTetromino() {
    const tetrominoes = [
      [[1, 1, 1, 1]],
      [[1, 1], [1, 1]],
      [[0, 1, 0], [1, 1, 1]],
      [[1, 1, 0], [0, 1, 1]],
      [[0, 1, 1], [1, 1, 0]],
    ];

    const shape =
      tetrominoes[Math.floor(Math.random() * tetrominoes.length)];

    return { shape, x: Math.floor(this.grid[0].length / 2) - 1, y: 0 };
  }

  private moveTetromino(direction: number) {
    this.activeTetromino.x += direction;
    if (this.checkCollision()) {
      this.activeTetromino.x -= direction;
    }
  }

  private dropTetromino() {
    this.activeTetromino.y += 1;
    if (this.checkCollision()) {
      this.activeTetromino.y -= 1;
      this.mergeTetromino();
      this.clearLines();
      this.activeTetromino = this.nextTetromino;
      this.nextTetromino = this.generateTetromino();
      if (this.checkCollision()) {
        this.gameOver = true;
      }
    }
  }

  private rotateTetromino() {
    const originalShape = this.activeTetromino.shape;
    this.activeTetromino.shape = this.activeTetromino.shape[0].map((_, colIndex) =>
      this.activeTetromino.shape.map((row) => row[colIndex]).reverse()
    );

    if (this.checkCollision()) {
      this.activeTetromino.shape = originalShape;
    }
  }

  private checkCollision() {
    const { shape, x, y } = this.activeTetromino;

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (
          shape[row][col] &&
          (this.grid[y + row] === undefined ||
            this.grid[y + row][x + col] === undefined ||
            this.grid[y + row][x + col])
        ) {
          return true;
        }
      }
    }
    return false;
  }

  private mergeTetromino() {
    const { shape, x, y } = this.activeTetromino;

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          this.grid[y + row][x + col] = shape[row][col];
        }
      }
    }
  }

  private clearLines() {
    this.grid = this.grid.filter((row) => row.some((cell) => cell === 0));

    while (this.grid.length < this._canvasHeight / 20) {
      this.grid.unshift(Array(this._canvasWidth / 20).fill(0));
    }

    this.score += 10;
  }

  private updateGame() {
    this.dropTetromino();
  }

  private renderGame() {
    this._context.clearRect(0, 0, this._canvasWidth, this._canvasHeight);

    this.drawGrid();
    this.drawTetromino(this.activeTetromino);
    this.drawScore();
  }

  private drawGrid() {
    this._context.fillStyle = "#000000";
    this._context.fillRect(0, 0, this._canvasWidth, this._canvasHeight);

    this._context.fillStyle = "#CCCCCC";
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        if (this.grid[row][col]) {
          this._context.fillRect(col * 20, row * 20, 20, 20);
        }
      }
    }
  }

  private drawTetromino({ shape, x, y }: { shape: number[][]; x: number; y: number }) {
    this._context.fillStyle = "#00FF00";
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          this._context.fillRect((x + col) * 20, (y + row) * 20, 20, 20);
        }
      }
    }
  }

  private drawScore() {
    this._context.fillStyle = "#FFFFFF";
    this._context.font = "20px Arial";
    this._context.fillText(`Score: ${this.score}`, 10, 30);
  }
}

setupModuleUsage("TetrisGame", TetrisGame);
