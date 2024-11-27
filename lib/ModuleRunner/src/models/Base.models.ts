export interface BaseModule {
  stoppable?: boolean;
  shouldForcePause?: boolean;
  duration: number;
  start(): void;
  stop(): void;
  resume(): void;
  onComplete(): void;
  onDestroy(): void;

  onFrameUpdate?: unknown;
}

export interface StoppableModule extends BaseModule {
  stoppable: true;
  set onFrameUpdate(callback: (elapsed: number) => void);
}

export type TimelineModule = BaseModule | StoppableModule;

export interface RequiredTimelineModuleProps {
  duration: number;
}
