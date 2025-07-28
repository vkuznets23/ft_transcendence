import { Obstacle } from './generateObstacle'
import { type DifficultyOption } from '../components/game'

const PADDLE_THICKNESS = 10
const paddleOffset = 10

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
  difficulty: DifficultyOption
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
  difficulty,
  obstacle,
}: VerticalDrawParams) {
  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = '#1A1A1A'
  ctx.fillRect(0, 0, width, height)

  // Игрок 1 — Левый верхний угол
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText(`${score1}`, 20, 20)

  // Игрок 2 — Правый нижний угол
  ctx.textAlign = 'right'
  ctx.textBaseline = 'bottom'
  ctx.fillText(`${score2}`, width - 20, height - 20)

  ctx.fillStyle = 'white'

  // Ракетки (горизонтальные сверху и снизу)
  // Верхняя
  ctx.fillRect(player1X, paddleOffset, paddleWidth, PADDLE_THICKNESS)
  // Нижняя
  ctx.fillRect(
    player2X,
    height - PADDLE_THICKNESS - paddleOffset,
    paddleWidth,
    PADDLE_THICKNESS
  )

  if (difficulty === 'hard' && obstacle) {
    ctx.fillStyle = 'red'
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
  }
  if (obstacle) {
    const { x, y, width, height } = obstacle
    ctx.fillStyle = 'red'
    ctx.fillRect(x, y, width, height)
  }

  // Мяч
  ctx.fillStyle = 'white'
  ctx.beginPath()
  ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2)
  ctx.fill()
}
