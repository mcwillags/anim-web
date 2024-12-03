import { TimelineAnimation, TimelineItemProps } from '../models';
import { BaseTimelineItem } from "../BaseTimelineItem";

export class RandomElementAnimation 
  extends BaseTimelineItem 
  implements TimelineAnimation {
  private elements: { x: number; y: number; size: number; color: string }[] = [];
  private context: CanvasRenderingContext2D | null = null;

  constructor({ duration }: TimelineItemProps) {
    super(duration);
    this.createElements(10);  
  }

  
  init(context: CanvasRenderingContext2D): void {
    this.context = context;
  }

  
  private createElements(count: number): void {
    for (let i = 0; i < count; i++) {
      this.elements.push({
        x: Math.random() * 800,  
        y: Math.random() * 450,  
        size: Math.random() * 100 + 50,  
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

    
    for (const element of this.elements) {
      element.x += Math.random() * 2 - 1;  
      element.y += Math.random() * 2 - 1;  

      element.size = Math.random() * 100 + 50;  

      /
      if (element.x < 0 || element.x > 800) {
        element.x = Math.random() * 800;  
      }
      if (element.y < 0 || element.y > 450) {
        element.y = Math.random() * 450;  
      }

      
      this.context.beginPath();
      this.context.arc(element.x, element.y, element.size, 0, Math.PI * 2);  
      this.context.fillStyle = element.color;  
      this.context.fill();  
    }
  }
}

