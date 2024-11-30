import { BaseAnimation } from "../../instances";
import { RequiredTimelineModuleProps, StoppableModule } from "../../models";
import { setupModuleUsage } from "../../utils";

export class DynamicWaveAnimation extends BaseAnimation implements StoppableModule {
    static isDev = true;

    private time = 0;
    private baseVelocity = 0.1;
    private velocity = this.baseVelocity;

    private MAX_OFFSET = 400;
    private SPACING = 4;
    private POINTS = this.MAX_OFFSET / this.SPACING;
    private PEAK = this.MAX_OFFSET * 0.25;
    private POINTS_PER_LAP = 6;
    private SHADOW_STRENGTH = 6;

    private _cycleDuration: number;
    private _timeScale: number;

    constructor({ duration }: RequiredTimelineModuleProps) {
        super(duration);

        this._cycleDuration = 5;
        this._timeScale = this._cycleDuration / duration;

        this.resize();
    }

    start() {
        this.velocity = this.baseVelocity * this._timeScale;
        this._start(this.__loop.bind(this));

        window.addEventListener("resize", this.resize.bind(this));
    }

    stop() {
        this._stop();

        window.removeEventListener("resize", this.resize.bind(this));
    }

    resume() {
        this._resume(this.__loop.bind(this));
    }

    private resize() {
        this._canvasWidth = window.innerWidth;
        this._canvasHeight = window.innerHeight;
    }

    private __loop(): void {
        this.time += this.velocity;

        this.clear();
        this.render();
    }

    private clear() {
        this._context.globalCompositeOperation = "source-over";
        this._context.shadowColor = "rgba(0, 0, 0, 0)";
        this._context.shadowBlur = 0;
        this._context.globalAlpha = 1;
        this._context.lineWidth = 1;

        this._context.clearRect(0, 0, this._canvasWidth, this._canvasHeight);
    }

    private render() {
        const cx = this._canvasWidth / 2;
        const cy = this._canvasHeight / 2;

        this._context.save();

        this._context.globalCompositeOperation = "lighter";
        this._context.strokeStyle = "#fff";
        this._context.shadowColor = "#fff";
        this._context.lineWidth = 2;
        this._context.beginPath();

        for (let i = this.POINTS; i > 0; i--) {
            const value = i * this.SPACING + (this.time % this.SPACING);

            const ax = Math.sin(value / this.POINTS_PER_LAP) * Math.PI;
            const ay = Math.cos(value / this.POINTS_PER_LAP) * Math.PI;

            const x = ax * value;
            let y = ay * value * 0.35;

            const o = 1 - Math.min(value, this.PEAK) / this.PEAK;

            y -= Math.pow(o, 2) * 200;
            y += (200 * value) / this.MAX_OFFSET;
            y += (x / cx) * this._canvasWidth * 0.1;

            this._context.globalAlpha = 1 - value / this.MAX_OFFSET;
            this._context.shadowBlur = this.SHADOW_STRENGTH * o;

            this._context.lineTo(cx + x, cy + y);
            this._context.stroke();

            this._context.beginPath();
            this._context.moveTo(cx + x, cy + y);
        }

        this._context.lineTo(cx, cy - 200);
        this._context.lineTo(cx, 0);
        this._context.stroke();

        this._context.restore();
    }
}

setupModuleUsage("DynamicWaveAnimation", DynamicWaveAnimation);
