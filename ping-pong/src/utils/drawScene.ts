import { Obstacle } from './generateObstacle'
import { type DifficultyOption } from '../types/types'

interface DrawSceneParams {
  ctx: CanvasRenderingContext2D
  canvasWidth: number
  canvasHeight: number
  paddleWidth: number
  paddleHeight: number
  ballSize: number
  score1: number
  score2: number
  player1Y: number
  player2Y: number
  ballX: number
  ballY: number
  difficulty: DifficultyOption
  obstacle?: Obstacle
}

const paddleOffset = 10

export function drawScene({
  ctx,
  canvasWidth,
  canvasHeight,
  paddleWidth,
  paddleHeight,
  ballSize,
  player1Y,
  player2Y,
  ballX,
  ballY,
  difficulty,
  obstacle,
}: DrawSceneParams) {
  // Сначала очищаем экран и заливаем фон
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  ctx.fillStyle = '#1A1A1A'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  // Ракетки
  ctx.fillStyle = 'white'

  // Игрок 1 (слева)
  // ctx.fillRect(0, player1Y, paddleWidth, paddleHeight)
  ctx.fillRect(paddleOffset, player1Y, paddleWidth, paddleHeight)

  // Игрок 2 (справа)
  // ctx.fillRect(canvasWidth - paddleWidth, player2Y, paddleWidth, paddleHeight)
  ctx.fillRect(
    canvasWidth - paddleWidth - paddleOffset,
    player2Y,
    paddleWidth,
    paddleHeight
  )

  // Препятствие
  if ((difficulty === 'hard' || difficulty === 'medium') && obstacle) {
    ctx.fillStyle = 'red'
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
  }

  // Мяч
  ctx.fillStyle = 'white'
  ctx.beginPath()
  ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2)
  ctx.fill()
}
