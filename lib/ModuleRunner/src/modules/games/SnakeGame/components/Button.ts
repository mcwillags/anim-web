import { isClickIntersecting } from "../../../../utils";

interface ButtonProps {
  x: number;
  y: number;
  text: string;
  width: number;
  height: number;
  canvas$: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
}

const DEFAULT_BUTTON_CONFIG = {
  buttonColor: "#69b05f",
  textColor: "#ffffff",
  textSize: 14,
  padding: 25,
};

export class ActionButton {
  private readonly _context: CanvasRenderingContext2D;
  private readonly _canvas$: HTMLCanvasElement;
  private readonly _y: number;
  private readonly _x: number;
  private readonly _width: number;
  private readonly _height: number;
  private readonly _text: string;
  private _onClick!: () => void;

  constructor({ context, canvas$, y, x, width, height, text }: ButtonProps) {
    this._context = context;
    this._height = height;
    this._width = width;
    this._text = text;
    this._canvas$ = canvas$;
    this._x = x;
    this._y = y;
  }

  render() {
    this._renderContainer();
    this._renderText();
  }

  destroy() {
    this._canvas$.removeEventListener("click", this._onClickHandler.bind(this));
  }

  private _renderContainer() {
    this._context.fillStyle = DEFAULT_BUTTON_CONFIG.buttonColor;

    this._context.beginPath();
    this._context.fillRect(
      this._x,
      this._y,
      this._width + DEFAULT_BUTTON_CONFIG.padding * 2,
      this._height,
    );
    this._context.stroke();
  }

  private _renderText() {
    this._context.fillStyle = DEFAULT_BUTTON_CONFIG.textColor;
    this._context.textAlign = "center";
    this._context.textBaseline = "middle";
    this._context.font = `${DEFAULT_BUTTON_CONFIG.textSize}px arial`;
    this._context.fillText(
      this._text,
      this._x + (this._width + DEFAULT_BUTTON_CONFIG.padding * 2) / 2,
      this._y + this._height / 2,
      this._width,
    );
  }

  private _initListener() {
    this._canvas$.addEventListener("click", this._onClickHandler.bind(this));
  }

  private _onClickHandler(event: MouseEvent) {
    const target = {
      x: this._x,
      y: this._y,
      width: this._width,
      height: this._height,
    };

    const click = {
      x: event.offsetX,
      y: event.offsetY,
    };

    if (isClickIntersecting(target, click)) {
      this._onClick();
    }
  }

  set onClick(callback: () => void) {
    this._onClick = callback;
    this._initListener();
  }
}
