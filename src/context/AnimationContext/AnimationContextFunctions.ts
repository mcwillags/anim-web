import { uuid } from "@utils";

export namespace AnimationContextFunctions {
  export const extractDraggableId = (draggableId: string) => {
    const [animationName] = draggableId.split("-");

    return animationName;
  };

  export const createDraggableId = (draggableId: string) => {
    return `${draggableId}-${uuid()}`;
  };
}
