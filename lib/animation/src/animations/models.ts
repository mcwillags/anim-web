export interface TimelineItem {
  proceed(context: CanvasRenderingContext2D, timestamp: number): void;

  get completed(): boolean;
}

export interface TimelineItemProps {
  duration: number;
}

export type TimelineAnimation = TimelineItem;

export type TimelineTimeout = TimelineItem;
