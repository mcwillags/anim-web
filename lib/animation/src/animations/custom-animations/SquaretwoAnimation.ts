import { TimelineAnimation, TimelineItemProps } from '../models';
import { BaseTimelineItem } from "../BaseTimelineItem";

export class RotatingElementsAnimation 
  extends BaseTimelineItem 
  implements TimelineAnimation {
  
  private elements: { x: number; y: number; size: number; color: string }[] = [];
  private angle: number = 0;
  private radius: number = 120;
  private centerX: number = 0;
  private centerY: number = 0;
  private speed: number = 0.01;
  private context: CanvasRenderingContext2D | null = null;

  constructor({ duration }: TimelineItemProps) {
    super(duration);
    this.createElements(4);
  }

  
  init(context: CanvasRenderingContext2D): void {
    this.context = context;
  }

  
  private createElements(count: number): void {
    for (let i = 0; i < count; i++) {
      this.elements.push({
        x: 0,  
        y: 0,
        size: 50,  
        color: this.getRandomColor()  
      });
    }
  }

  
  private getRandomColor(): string {
    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
  }

  
  update(timestamp: number): void {
    if (!this.context) return;

    
    this.calculateRemainingDuration(timestamp);

    
    this.context.clearRect(0, 0, 800, 450);

    
    this.centerX = 800 / 2;
    this.centerY = 450 / 2;

    
    this.angle += this.speed;

    
    this.elements.forEach((element, index) => {
      const x = this.centerX + this.radius * Math.cos(this.angle + (index * Math.PI / 2));
      const y = this.centerY + this.radius * Math.sin(this.angle + (index * Math.PI / 2));

      element.x = x - element.size / 2;
      element.y = y - element.size / 2;

      this.context.fillStyle = element.color;
      this.context.fillRect(element.x, element.y, element.size, element.size);
    });
  }
}
