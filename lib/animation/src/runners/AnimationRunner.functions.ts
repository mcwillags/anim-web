export namespace AnimationRunnerFunctions {
  export const shouldPlayFrame = (frameDiff: number, fps: number) => {
    const millisecondsPerFrame = 1000 / fps;

    return frameDiff >= millisecondsPerFrame;
  };
}
