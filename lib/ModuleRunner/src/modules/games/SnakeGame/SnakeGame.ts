import { BaseConstants } from "../../../constants";
import { shouldPlayFrame } from "../../../utils";
import { BaseModule, RequiredTimelineModuleProps } from "../../../models";
import { ActionButton, GameRenderer } from "./components";
import { setupModuleUsage } from "../../../utils";

export default class SnakeGame implements BaseModule {
  public shouldForcePause = true;

  private _canvas$!: HTMLCanvasElement;
  private _context!: CanvasRenderingContext2D;
  private _playing: boolean = false;
  private _gameCompleted: boolean = false;
  private _onComplete!: (forcePause?: boolean) => void;
  private _leadingAnimationFrame?: number;
  private readonly _durationMs: number;

  private _prevTimestamp?: number;

  private _renderer!: GameRenderer;
  private _actionButton!: ActionButton;

  constructor({ duration }: RequiredTimelineModuleProps) {
    this._durationMs = duration;
    this._init();
  }

  private _init() {
    this._initRenderingComponents();
    this._initButton();
    this._initRenderer();
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
  }

  private _initButton() {
    const BUTTON_WIDTH = 100;
    const BUTTON_HEIGHT = 50;

    const buttonProps = {
      x: this._canvas$.width / 2 - BUTTON_WIDTH / 2,
      y: this._canvas$.height / 2 - BUTTON_HEIGHT / 2,
      width: BUTTON_WIDTH,
      height: BUTTON_HEIGHT,
      canvas$: this._canvas$,
      context: this._context,
      text: "Complete module",
    };

    this._actionButton = new ActionButton(buttonProps);

    this._actionButton.onClick = this._onActionButtonClick.bind(this);
  }

  private _initRenderer() {
    this._renderer = new GameRenderer(this._context);
    this._renderer.init();
  }

  start() {
    this._playing = true;
    this._canvas$.style.visibility = "visible";
    this._loop();

    setTimeout(() => (this._gameCompleted = true), 2500);
  }

  stop() {
    return;
  }

  resume() {
    return;
  }

  public onDestroy() {
    cancelAnimationFrame(this._leadingAnimationFrame as number);
    this._actionButton.destroy();
  }

  private _loop() {
    if (!this._playing) return;

    if (!this._shouldPlayNextFrame()) {
      this._leadingAnimationFrame = requestAnimationFrame(() => this._loop());
      return;
    }

    if (!this._gameCompleted) {
      this._renderer.render();
    }

    if (this._gameCompleted) {
      this._renderButton();
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

  private _renderButton() {
    this._actionButton.render();
  }

  private _onActionButtonClick() {
    this._completeItem();
  }

  private _completeItem() {
    cancelAnimationFrame(this._leadingAnimationFrame as number);
    this._context.clearRect(0, 0, 1200, 590);
    this._canvas$.style.visibility = "hidden";
    this._playing = false;
    this._onComplete(true);
  }

  public set onComplete(callback: () => void) {
    this._onComplete = callback;
  }

  public get duration(): number {
    return this._durationMs;
  }
}

setupModuleUsage("SnakeGame", SnakeGame);
