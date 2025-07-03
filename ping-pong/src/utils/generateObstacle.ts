export interface Obstacle {
  x: number
  y: number
  width: number
  height: number
}

export const generateRandomObstacle = (
  CANVAS_WIDTH: number,
  CANVAS_HEIGHT: number
): Obstacle => {
  const size = 80
  const margin = 50
  const x = margin + Math.random() * (CANVAS_WIDTH - size - 2 * margin)
  const y = margin + Math.random() * (CANVAS_HEIGHT - size - 2 * margin)
  return { x, y, width: size, height: size }
}
