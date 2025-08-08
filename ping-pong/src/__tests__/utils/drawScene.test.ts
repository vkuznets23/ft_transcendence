import { drawScene } from '../../utils/drawScene'
import { Obstacle } from '../../utils/generateObstacle'

describe('drawScene', () => {
  let ctx: Partial<CanvasRenderingContext2D>
  const canvasWidth = 800
  const canvasHeight = 600
  const paddleWidth = 10
  const paddleHeight = 100
  const ballSize = 10
  const paddleOffset = 10

  beforeEach(() => {
    let fillStyleValue = ''
    ctx = {
      clearRect: jest.fn(),
      fillRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      get fillStyle() {
        return fillStyleValue
      },
      set fillStyle(value: string) {
        fillStyleValue = value
        fillStyleCalls.push(value)
      },
    }
    fillStyleCalls = []
  })

  let fillStyleCalls: string[] = []

  it('clears canvas and draws background', () => {
    drawScene({
      ctx: ctx as CanvasRenderingContext2D,
      canvasWidth,
      canvasHeight,
      paddleWidth,
      paddleHeight,
      ballSize,
      score1: 0,
      score2: 0,
      player1Y: 50,
      player2Y: 100,
      ballX: 400,
      ballY: 300,
      difficulty: 'easy',
    })

    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, canvasWidth, canvasHeight)
    expect(ctx.fillStyle).toBe('white')
    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, canvasWidth, canvasHeight)
  })

  it('draws paddles', () => {
    drawScene({
      ctx: ctx as CanvasRenderingContext2D,
      canvasWidth,
      canvasHeight,
      paddleWidth,
      paddleHeight,
      ballSize,
      score1: 0,
      score2: 0,
      player1Y: 50,
      player2Y: 100,
      ballX: 400,
      ballY: 300,
      difficulty: 'easy',
    })

    expect(ctx.fillStyle).toBe('white')
    expect(ctx.fillRect).toHaveBeenCalledWith(
      paddleOffset,
      50,
      paddleWidth,
      paddleHeight
    )
    expect(ctx.fillRect).toHaveBeenCalledWith(
      canvasWidth - paddleWidth - paddleOffset,
      100,
      paddleWidth,
      paddleHeight
    )
  })

  it('draws obstacle if difficulty medium or hard', () => {
    const obstacle: Obstacle = { x: 200, y: 200, width: 20, height: 20 }

    drawScene({
      ctx: ctx as CanvasRenderingContext2D,
      canvasWidth,
      canvasHeight,
      paddleWidth,
      paddleHeight,
      ballSize,
      score1: 0,
      score2: 0,
      player1Y: 50,
      player2Y: 100,
      ballX: 400,
      ballY: 300,
      difficulty: 'medium',
      obstacle,
    })

    expect(fillStyleCalls).toContain('red')
    expect(ctx.fillRect).toHaveBeenCalledWith(
      obstacle.x,
      obstacle.y,
      obstacle.width,
      obstacle.height
    )
  })

  it('draws the ball', () => {
    drawScene({
      ctx: ctx as CanvasRenderingContext2D,
      canvasWidth,
      canvasHeight,
      paddleWidth,
      paddleHeight,
      ballSize,
      score1: 0,
      score2: 0,
      player1Y: 50,
      player2Y: 100,
      ballX: 400,
      ballY: 300,
      difficulty: 'easy',
    })

    expect(ctx.beginPath).toHaveBeenCalled()
    expect(ctx.arc).toHaveBeenCalledWith(400, 300, ballSize, 0, Math.PI * 2)
    expect(ctx.fill).toHaveBeenCalled()
  })
})
