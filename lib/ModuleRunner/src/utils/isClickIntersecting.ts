interface Coordinates {
  x: number;
  y: number;
}

interface Target extends Coordinates {
  width: number;
  height: number;
}

export const isClickIntersecting = (
  targetCoordinates: Target,
  clickCoordinates: Coordinates,
): boolean => {
  const isIntersectingHorizontally =
    clickCoordinates.x > targetCoordinates.x &&
    clickCoordinates.x < targetCoordinates.x + targetCoordinates.width;
  const isIntersectingVertically =
    clickCoordinates.y > targetCoordinates.y &&
    clickCoordinates.y < targetCoordinates.y + targetCoordinates.height;

  return isIntersectingHorizontally && isIntersectingVertically;
};
