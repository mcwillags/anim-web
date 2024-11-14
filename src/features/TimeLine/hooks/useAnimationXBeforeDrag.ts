import * as React from "react";

export const useAnimationPropertiesBeforeDrag = (
  animationX: number,
  isDragging: boolean,
) => {
  const prevX = React.useRef(animationX);

  const props = React.useMemo(() => {
    if (isDragging) {
      return prevX.current;
    }

    prevX.current = animationX;
    return animationX;
  }, [animationX, isDragging]);

  return props;
};
