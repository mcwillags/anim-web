import { BaseModule, RequiredTimelineModuleProps } from "../../../models";
import { ActionButton, GameRenderer } from "./components";
import { setupModuleUsage } from "../../../utils";
import { BaseGame } from "../../../instances";

const SNAKE_GAME_FPS = 15;

export class SnakeGame extends BaseGame implements BaseModule {
  static isDev = true;
  public shouldForcePause = true;

  private _gameCompleted: boolean = false;

  private _renderer!: GameRenderer;
  private _actionButton!: ActionButton;

  constructor({ duration }: RequiredTimelineModuleProps) {
    super(duration, SNAKE_GAME_FPS);
    this._init();
  }

  private _init() {
    this._initRenderingComponents();
    this._initButton();
    this._initRenderer();
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
  }

  public start() {
    this._start(this._render.bind(this));
    setTimeout(() => (this._gameCompleted = true), 2500);
  }

  public onDestroy() {
    this._cleanUp();
    this._actionButton.destroy();
  }

  private _render() {
    if (!this._gameCompleted) {
      this._renderer.render();
    }

    if (this._gameCompleted) {
      this._renderButton();
    }
  }

  private _renderButton() {
    this._actionButton.render();
  }

  private _onActionButtonClick() {
    this._completeItem();
  }

  private _completeItem() {
    this._cleanUp();
    if (this._onComplete) {
      this._onComplete(true);
    }
  }
}

setupModuleUsage("SnakeGame", SnakeGame);
