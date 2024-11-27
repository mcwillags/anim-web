import * as React from "react";
import {
  CanvasContainer,
  StyledCanvas,
  ControlsContainer,
  ControlButton,
  StyledIFrame,
  StyledVideo,
  PlayerContainer,
  Timer,
} from "./Canvas.styles";

import { useTimeline } from "@context/TimelineContext/";
import { SimplifiedTimeline } from "@context/TimelineContext/";

import {
  BaseConstants,
  TimelineModule,
  CanvasConstants,
  ModuleRunner,
} from "@lib/ModuleRunner";
import { SaveTimelinePopup } from "./components";
import { ModuleRunnerFunctions } from "./ModulePlayer.functions.ts";

export const ModulePlayer = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const runner = React.useRef<ModuleRunner>();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [simplifiedTimeline, setSimplifiedTimeline] =
    React.useState<SimplifiedTimeline>([]);
  const { createTimeline, timelineTimestamp, updateTimelineTimestamp } =
    useTimeline();
  const [isStarted, setIsStarted] = React.useState(false);
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);

  const handlePlay = () => {
    if (!runner.current || runner.current.completed) return;

    setIsPlaying(true);
    setIsStarted(true);

    runner.current!.start();
  };

  const handleResume = () => {
    if (!runner.current || runner.current.completed) return;

    runner.current!.resume();
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (!runner.current || runner.current.completed) return;

    runner.current!.stop();
    setIsPlaying(false);
  };

  const handleResetTimeline = () => {
    handlePause();
    setIsStarted(false);
    updateTimelineTimestamp(null);
    setSimplifiedTimeline(createTimeline());
  };

  const handleRunnerComplete = () => {
    setIsPlaying(false);
  };

  const handleForcePause = () => {
    setIsPlaying(false);
  };

  const handleForcePlay = () => {
    setIsPlaying(true);
  };

  const handleSaveTimeline = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  React.useLayoutEffect(() => {
    const canvas$ = canvasRef.current;

    if (canvas$ === null) {
      throw new Error("Canvas component is null");
    }

    canvas$.width = CanvasConstants.canvasWidth;
    canvas$.height = CanvasConstants.canvasHeight;

    const timeline: TimelineModule[] = simplifiedTimeline
      .map(({ name, duration }) =>
        window.CustomModules[name]
          ? new window.CustomModules[name]({ duration })
          : undefined,
      )
      .filter((module) => module !== undefined);

    runner.current = new ModuleRunner(timeline);
    runner.current.onComplete = handleRunnerComplete;
    runner.current.onForcePlay = handleForcePlay;
    runner.current.onForcePause = handleForcePause;
    runner.current.onFrameUpdate = (elapsed: number) => {
      updateTimelineTimestamp(elapsed);
    };

    return () => {
      runner.current!.onDestroy();
    };
  }, [simplifiedTimeline]);

  return (
    <CanvasContainer>
      <PlayerContainer>
        <StyledCanvas ref={canvasRef} id={BaseConstants.canvasId} />
        <StyledIFrame id={BaseConstants.iframeId} />
        <StyledVideo
          id={BaseConstants.videoId}
          controls={false}
          autoPlay={true}
          muted={true}
        />
      </PlayerContainer>

      <ControlsContainer>
        {!isStarted ? (
          <ControlButton onClick={handlePlay} title="Play">
            ▶
          </ControlButton>
        ) : (
          <>
            {isPlaying ? (
              <ControlButton onClick={handlePause} title="Play">
                ❚❚
              </ControlButton>
            ) : (
              <ControlButton onClick={handleResume} title="Pause">
                ▶
              </ControlButton>
            )}
          </>
        )}
        <ControlButton onClick={handleResetTimeline}>⟳</ControlButton>
        {simplifiedTimeline.length ? (
          <ControlButton onClick={handleSaveTimeline}>💾</ControlButton>
        ) : null}
        <Timer>{ModuleRunnerFunctions.formatTimer(timelineTimestamp)}</Timer>
      </ControlsContainer>
      {isPopupOpen && <SaveTimelinePopup onClose={handlePopupClose} />}
    </CanvasContainer>
  );
};
