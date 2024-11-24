import { OnDragEndResponder } from "react-beautiful-dnd";

export interface IAnimationContext {
  animations: string[];
  removeAnimation: (id: string) => void;
  onAnimationDrop: OnDragEndResponder;
}
