import { BaseAnimation } from "../../instances";
import { RequiredTimelineModuleProps, StoppableModule } from "../../models";
import { setupModuleUsage } from "../../utils";

const DOTS_AMOUNT = 1000; 
const DOT_RADIUS = 4;
const DOT_COLOR = "lime";

class Dot {
  x: number;
  y: number;
  z: number;
  xProject: number;
  yProject: number;
  sizeProjection: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.xProject = 0;
    this.yProject = 0;
    this.sizeProjection = 0;
  }

  project(
    sin: number,
    cos: number,
    GLOBE_CENTER_Z: number,
    FIELD_OF_VIEW: number,
    PROJECTION_CENTER_X: number,
    PROJECTION_CENTER_Y: number
  ) {
    const rotX = cos * this.x + sin * (this.z - GLOBE_CENTER_Z);
    const rotZ = -sin * this.x + cos * (this.z - GLOBE_CENTER_Z) + GLOBE_CENTER_Z;
    this.sizeProjection = FIELD_OF_VIEW / (FIELD_OF_VIEW - rotZ);
    this.xProject = rotX * this.sizeProjection + PROJECTION_CENTER_X;
    this.yProject = this.y * this.sizeProjection + PROJECTION_CENTER_Y;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    sin: number,
    cos: number,
    GLOBE_CENTER_Z: number,
    FIELD_OF_VIEW: number,
    PROJECTION_CENTER_X: number,
    PROJECTION_CENTER_Y: number
  ) {
    this.project(
      sin,
      cos,
      GLOBE_CENTER_Z,
      FIELD_OF_VIEW,
      PROJECTION_CENTER_X,
      PROJECTION_CENTER_Y
    );
    ctx.beginPath();
    ctx.arc(this.xProject, this.yProject, DOT_RADIUS * this.sizeProjection, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = DOT_COLOR;
    ctx.fill();
  }
}

export class GlobeAnimation extends BaseAnimation implements StoppableModule {
  static isDev = true;

  private dots: Dot[] = [];
  private rotation: number = 0;
  private width: number;
  private height: number;
  private GLOBE_RADIUS: number;
  private GLOBE_CENTER_Z: number;
  private PROJECTION_CENTER_X: number;
  private PROJECTION_CENTER_Y: number;
  private FIELD_OF_VIEW: number;
  private _cycleDuration: number;
  private _timeScale: number;

  constructor({ duration }: RequiredTimelineModuleProps) {
    super(duration);
    this.width = this._canvasWidth;
    this.height = this._canvasHeight;

    this.GLOBE_RADIUS = this.width * 0.33;
    this.GLOBE_CENTER_Z = -this.GLOBE_RADIUS;
    this.PROJECTION_CENTER_X = this.width / 2;
    this.PROJECTION_CENTER_Y = this.height / 2;
    this.FIELD_OF_VIEW = this.width * 0.8;

    this._cycleDuration = 5;
    this._timeScale = duration / this._cycleDuration;

    this.createDots();
  }

  private createDots() {
    this.dots.length = 0;
    for (let i = 0; i < DOTS_AMOUNT; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      const x = this.GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta);
      const y = this.GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta);
      const z = this.GLOBE_RADIUS * Math.cos(phi) + this.GLOBE_CENTER_Z;
      this.dots.push(new Dot(x, y, z));
    }
  }

  public start() {
    this._start(this.__loop.bind(this));
  }

  public stop() {
    this._stop();
  }

  public resume() {
    this._resume(this.__loop.bind(this));
  }

  private __loop(): void {
    const ctx = this._context;
    ctx.clearRect(0, 0, this.width, this.height);

    this.rotation += 0.001 * this._timeScale;
    const sineRotation = Math.sin(this.rotation);
    const cosineRotation = Math.cos(this.rotation);

    for (const dot of this.dots) {
      dot.draw(
        ctx,
        sineRotation,
        cosineRotation,
        this.GLOBE_CENTER_Z,
        this.FIELD_OF_VIEW,
        this.PROJECTION_CENTER_X,
        this.PROJECTION_CENTER_Y
      );
    }
  }
}

setupModuleUsage("GlobeAnimation", GlobeAnimation);
