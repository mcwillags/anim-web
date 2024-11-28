import { BaseConstants } from "../constants";

export const shouldPlayFrame = (
  frameDelta: number,
  fps = BaseConstants.FPS,
) => {
  const frameInterval = 1000 / fps;

  return frameDelta >= frameInterval;
};
