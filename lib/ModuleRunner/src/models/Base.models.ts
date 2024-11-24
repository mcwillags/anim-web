export interface BaseModule {
  shouldForcePause?: boolean;
  start(): void;
  stop(): void;
  resume(): void;
  onComplete(): void;
  onDestroy(): void;
}
