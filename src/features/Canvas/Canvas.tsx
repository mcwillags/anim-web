import * as React from "react";
import {
  CanvasContainer,
  StyledCanvas,
  ControlsContainer,
  ControlButton,
  StyledIFrame,
  StyledVideo,
  PlayerContainer,
} from "./Canvas.styles";

import { useTimeline } from "@context/TimelineContext/";
import { SimplifiedTimeline } from "@context/TimelineContext/";

import { TimelineRunner } from "@lib/TimelineRunner";
import { SpringVideo } from "@lib/TimelineRunner/src/TimelineItems/videos";
import { JSONPlaceholderDisplay } from "@lib/TimelineRunner/src/TimelineItems/iFrames";
import {
  CircleAnimation,
  SlideInAnimation,
  SnowflakeAnimation,
  Timeout,
} from "@lib/TimelineRunner/src/TimelineItems/animations";
import { BaseTimelineItem } from "@lib/TimelineRunner/src/models";

const AVAILABLE_ANIMATIONS: Record<string, any> = {
  SlideInAnimation: SlideInAnimation,
  CircleAnimation: CircleAnimation,
  SnowflakeAnimation: SnowflakeAnimation,
  Timeout: Timeout,
  SpringVideo: SpringVideo,
  JSONPlaceholderDisplay: JSONPlaceholderDisplay,
};

export const Canvas = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const runner = React.useRef<TimelineRunner>();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [simplifiedTimeline, setSimplifiedTimeline] =
    React.useState<SimplifiedTimeline>([]);
  const { createTimeline } = useTimeline();
  const [isStarted, setIsStarted] = React.useState(false);

  React.useLayoutEffect(() => {
    const canvas$ = canvasRef.current;
    const video$ = videoRef.current;
    const iframe$ = iframeRef.current;

    if (canvas$ === null) {
      throw new Error("Canvas Rendering Context is null");
    }

    if (video$ === null) {
      throw new Error("Video element is null");
    }

    if (iframe$ === null) {
      throw new Error("iframe element is null");
    }

    canvas$.width = 800;
    canvas$.height = 450;

    const timeline: BaseTimelineItem<any>[] = simplifiedTimeline.map(
      ({ name, duration }) =>
        AVAILABLE_ANIMATIONS[name]
          ? new AVAILABLE_ANIMATIONS[name]({ duration })
          : undefined,
    );

    runner.current = new TimelineRunner({ canvas$, video$, iframe$, timeline });

    return () => {
      runner.current?.destroy();
    };
  }, [simplifiedTimeline]);

  const handlePlay = () => {
    const context = canvasRef.current?.getContext("2d");
    if (!context || !runner.current) return;

    runner.current.start();
    setIsPlaying(true);
    setIsStarted(true);
  };

  const handleResume = () => {
    if (!runner.current) return;

    runner.current.resume();
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (!runner.current) return;

    runner.current.stop();
    setIsPlaying(false);
  };

  const handleResetTimeline = () => {
    handlePause();
    setIsStarted(false);
    setSimplifiedTimeline(createTimeline());
  };

  return (
    <CanvasContainer>
      <PlayerContainer>
        <StyledCanvas ref={canvasRef} />
        <StyledIFrame ref={iframeRef} />
        <StyledVideo
          ref={videoRef}
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
      </ControlsContainer>
    </CanvasContainer>
  );
};
