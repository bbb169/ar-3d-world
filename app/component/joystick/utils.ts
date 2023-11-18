export const calcDistance = (
  p1: { x: number; y: number },
  p2: { x: number; y: number }
) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  return Math.sqrt((dx * dx) + (dy * dy));
};

/**
 *
 * @param p1
 * @param p2
 * @returns Angle in degrees
 */
export const calcAngle = (
  p1: { x: number; y: number },
  p2: { x: number; y: number }
) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  const rawAngle = radiansToDegrees(Math.atan2(dy, dx));
  if (rawAngle < 0) {
return 180 - Math.abs(rawAngle);
}
  return rawAngle + 180;
};

export const degreesToRadians = (a: number) => {
  return a * (Math.PI / 180);
};

export const radiansToDegrees = (a: number) => {
  return a * (180 / Math.PI);
};

export const findCoord = (
  position: { x: number; y: number },
  distance: number,
  angle: number
) => {
  const newB = { x: 0, y: 0 };
  angle = degreesToRadians(angle);
  newB.x = position.x + (distance * Math.cos(angle));
  newB.y = position.y + (distance * Math.sin(angle));
  if (newB.y < 0) {
    newB.y += 150;
  }
  return newB;
};
