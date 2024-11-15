import * as React from "react";
import {
  CanvasContainer,
  StyledCanvas,
  ControlsContainer,
  ControlButton,
} from "./Canvas.styles";
import {
  AppAnimationRunner,
  SequentialAnimationEngine,
  SlideInAnimation,
  CircleAnimation,
  SnowflakeAnimation,
  Timeout,
} from "@lib/animation";

import { useTimeline } from "@context/TimelineContext/";
import { SimplifiedTimeline } from "@context/TimelineContext/";

const AVAILABLE_ANIMATIONS: Record<string, any> = {
  SlideInAnimation: SlideInAnimation,
  CircleAnimation: CircleAnimation,
  SnowflakeAnimation: SnowflakeAnimation,
  Timeout: Timeout,
};

export const Canvas = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const runner = React.useRef<AppAnimationRunner>();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [simplifiedTimeline, setSimplifiedTimeline] =
    React.useState<SimplifiedTimeline>([]);
  const { createTimeline } = useTimeline();

  React.useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 800;
    canvas.height = 450;

    const canvasContext = canvas.getContext("2d");
    if (!canvasContext) return;

    const timeline = simplifiedTimeline.map(({ name, duration }) => {
      if (AVAILABLE_ANIMATIONS[name] === undefined) return;

      return new AVAILABLE_ANIMATIONS[
        name as keyof typeof AVAILABLE_ANIMATIONS
      ]({
        duration,
      });
    });

    runner.current = new AppAnimationRunner(
      SequentialAnimationEngine,
      timeline,
    );
  }, [simplifiedTimeline]);

  const handlePlay = () => {
    const context = canvasRef.current?.getContext("2d");
    if (!context || !runner.current) return;

    runner.current.start(context);
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (!runner.current) return;

    runner.current.stop();
    setIsPlaying(false);
  };

  const handleResetTimeline = () => {
    handlePause();
    setSimplifiedTimeline(createTimeline());
  };

  return (
    <CanvasContainer>
      <StyledCanvas ref={canvasRef} />
      <ControlsContainer>
        {!isPlaying ? (
          <ControlButton onClick={handlePlay} title="Play">
            ▶
          </ControlButton>
        ) : (
          <ControlButton onClick={handlePause} title="Pause">
            ❚❚
          </ControlButton>
        )}
        <ControlButton onClick={handleResetTimeline}>⟳</ControlButton>
      </ControlsContainer>
    </CanvasContainer>
  );
};
