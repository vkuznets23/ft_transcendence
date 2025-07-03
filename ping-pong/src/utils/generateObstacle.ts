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
  const margin = 10
  const x = margin + Math.random() * (CANVAS_WIDTH - size - margin * 2)
  const y = margin + Math.random() * (CANVAS_HEIGHT - size - margin * 2)
  return { x, y, width: size, height: size }
}
