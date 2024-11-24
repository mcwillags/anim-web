export const shouldPlayFrame = (fps: number, frameDiff: number) => {
  const millisecondsPerFrame = 1000 / fps;

  return frameDiff >= millisecondsPerFrame;
};