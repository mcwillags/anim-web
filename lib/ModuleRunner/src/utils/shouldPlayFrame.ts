import { BaseConstants } from "../constants";

export const shouldPlayFrame = (frameDelta: number) =>
  frameDelta >= BaseConstants.FPS;
