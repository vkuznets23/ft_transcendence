import { Obstacle } from './generateObstacle'

const PADDLE_THICKNESS = 10

interface VerticalDrawParams {
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  paddleWidth: number
  ballSize: number
  score1: number
  score2: number
  player1X: number
  player2X: number
  ballX: number
  ballY: number
  obstacle?: Obstacle | null
}

export function drawVerticalScene({
  ctx,
  width,
  height,
  paddleWidth,
  ballSize,
  score1,
  score2,
  player1X,
  player2X,
  ballX,
  ballY,
  obstacle,
}: VerticalDrawParams) {
  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = '#1A1A1A'
  ctx.fillRect(0, 0, width, height)

  // Счёт
  ctx.fillStyle = 'white'
  ctx.font = '48px sans-serif'
  ctx.fillText(`${score1}`, width / 4, 50)
  ctx.fillText(`${score2}`, (width * 3) / 4, 50)

  ctx.fillStyle = 'white'

  // Ракетки (горизонтальные сверху и снизу)
  // Верхняя
  ctx.fillRect(player1X, 0, paddleWidth, PADDLE_THICKNESS)
  // Нижняя
  ctx.fillRect(
    player2X,
    height - PADDLE_THICKNESS,
    paddleWidth,
    PADDLE_THICKNESS
  )
  if (obstacle) {
    const { x, y, width, height } = obstacle
    ctx.fillStyle = '#888'
    ctx.fillRect(x, y, width, height)
  }

  // Мяч
  ctx.beginPath()
  ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2)
  ctx.fill()
}
