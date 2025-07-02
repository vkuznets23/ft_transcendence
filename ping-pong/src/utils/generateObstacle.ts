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
  const width = 30
  const height = 150
  const margin = 50
  const x = margin + Math.random() * (CANVAS_WIDTH - width - 2 * margin)
  const y = margin + Math.random() * (CANVAS_HEIGHT - height - 2 * margin)
  return { x, y, width, height }
}
