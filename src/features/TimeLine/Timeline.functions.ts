const MILLISECONDS_IN_SECONDS = 1_000;

export namespace TimelineFunctions {
  const convertSecondsToMs = (seconds: number): number =>
    MILLISECONDS_IN_SECONDS * seconds;

  export const calculateCursorPosition = (
    elapsedMs: number,
    duration: number,
    trackWidth: number,
  ) => {
    const progress = elapsedMs / convertSecondsToMs(duration);

    return trackWidth * progress;
  };
}
