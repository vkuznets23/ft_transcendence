import { useEffect } from 'react'
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  BALL_SIZE,
  PADDLE_WIDTH,
} from '../utils/constants'

export function predictBallLandingY({
  ballX,
  ballY,
  ballSpeedX,
  ballSpeedY,
  targetX,
}: {
  ballX: number
  ballY: number
  ballSpeedX: number
  ballSpeedY: number
  targetX: number
}): number {
  let x = ballX
  let y = ballY
  let dx = ballSpeedX
  let dy = ballSpeedY

  if (
    (ballSpeedX > 0 && ballX > targetX) ||
    (ballSpeedX < 0 && ballX < targetX)
  ) {
    return ballY
  }

  while ((dx > 0 && x < targetX) || (dx < 0 && x > targetX)) {
    x += dx
    y += dy

    if (y - BALL_SIZE < 0 || y + BALL_SIZE > CANVAS_HEIGHT) {
      dy = -dy
    }
  }

  return Math.max(BALL_SIZE, Math.min(CANVAS_HEIGHT - BALL_SIZE, y))
}

const paddleX = CANVAS_WIDTH - PADDLE_WIDTH

export function useAIPlayer({
  isRunningRef,
  difficulty,
  playerYRef,
  paddleHeight,
  ballX,
  ballY,
  ballSpeedX,
  ballSpeedY,
  setUpPressed,
  setDownPressed,
  enabled,
}: {
  isRunningRef: React.MutableRefObject<boolean>
  difficulty: 'easy' | 'hard'
  playerYRef: React.MutableRefObject<number>
  paddleHeight: number
  ballX: React.MutableRefObject<number>
  ballY: React.MutableRefObject<number>
  ballSpeedX: React.MutableRefObject<number>
  ballSpeedY: React.MutableRefObject<number>
  setUpPressed: (value: boolean) => void
  setDownPressed: (value: boolean) => void
  enabled: boolean
}) {
  useEffect(() => {
    if (!enabled || !isRunningRef.current) return

    console.log('AI enabled, setting interval')

    const interval = setInterval(() => {
      if (!isRunningRef.current) return

      const prediction = predictBallLandingY({
        ballX: ballX.current,
        ballY: ballY.current,
        ballSpeedX: ballSpeedX.current,
        ballSpeedY: ballSpeedY.current,
        targetX: paddleX,
      })

      console.log('AI prediction:', prediction)

      const paddleCenter = playerYRef.current + paddleHeight / 2
      const margin = difficulty === 'easy' ? 30 : 10

      if (paddleCenter < prediction - margin) {
        setUpPressed(false)
        setDownPressed(true)
        console.log('AI: move down')
      } else if (paddleCenter > prediction + margin) {
        setUpPressed(true)
        setDownPressed(false)
        console.log('AI: move up')
      } else {
        setUpPressed(false)
        setDownPressed(false)
        console.log('AI: stop')
      }
    }, 30)

    return () => clearInterval(interval)
  }, [
    enabled,
    isRunningRef,
    difficulty,
    playerYRef,
    paddleHeight,
    ballX,
    ballY,
    ballSpeedX,
    ballSpeedY,
    setUpPressed,
    setDownPressed,
  ])
}
