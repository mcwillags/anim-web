const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;

export namespace ModuleRunnerFunctions {
  export const formatTimer = (elapsed: number) => {
    const elapsedMinutes = Math.floor(
      elapsed / MILLISECONDS_IN_SECOND / SECONDS_IN_MINUTE,
    );
    const elapsedSeconds = Math.floor(
      (elapsed - elapsedMinutes * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND) /
        MILLISECONDS_IN_SECOND,
    );

    const displayMinutes =
      elapsedMinutes > 9 ? `${elapsedMinutes}` : `0${elapsedMinutes}`;
    const displaySeconds =
      elapsedSeconds > 9 ? `${elapsedSeconds}` : `0${elapsedSeconds}`;

    return `${displayMinutes}:${displaySeconds}`;
  };
}
