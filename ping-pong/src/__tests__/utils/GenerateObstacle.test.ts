import { generateRandomObstacle, Obstacle } from '../../utils/generateObstacle'

describe('generateRandomObstacle', () => {
  const CANVAS_WIDTH = 800
  const CANVAS_HEIGHT = 600
  const SIZE = 80
  const MARGIN = 50

  it('returns an obstacle within canvas boundaries and with correct size', () => {
    const obstacle: Obstacle = generateRandomObstacle(
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    )

    expect(obstacle.width).toBe(SIZE)
    expect(obstacle.height).toBe(SIZE)

    expect(obstacle.x).toBeGreaterThanOrEqual(MARGIN)
    expect(obstacle.x).toBeLessThanOrEqual(CANVAS_WIDTH - SIZE - MARGIN)

    expect(obstacle.y).toBeGreaterThanOrEqual(MARGIN)
    expect(obstacle.y).toBeLessThanOrEqual(CANVAS_HEIGHT - SIZE - MARGIN)
  })

  it('generates different positions on multiple calls (likely)', () => {
    const obstacles = new Set()

    for (let i = 0; i < 10; i++) {
      const { x, y } = generateRandomObstacle(CANVAS_WIDTH, CANVAS_HEIGHT)
      obstacles.add(`${Math.round(x)}-${Math.round(y)}`)
    }

    expect(obstacles.size).toBeGreaterThan(1)
  })
})
