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

    // Конфигурация ошибок в зависимости от сложности
    const settings = {
      easy: {
        mistakeChance: 0.08, // выше шанс на ошибку
        ignoreChance: 0.05, // часто просто "зависает"
        reactionDelay: 160, // медленно реагирует
        maxOffset: 90, // ошибки крупнее
        margin: 50, // реагирует неточно
        fatigueStep: 0.2, // быстрее устаёт
        fatigueRecovery: 0.01,
      },
      hard: {
        mistakeChance: 0.02,
        ignoreChance: 0.01,
        reactionDelay: 100,
        maxOffset: 50,
        margin: 30,
        fatigueStep: 0.01,
        fatigueRecovery: 0.02,
      },
    }

    const config = settings[difficulty]
    let lastReactionTime = Date.now()
    let fatigueCounter = 0
    let fatigueLevel = 0

    const interval = setInterval(() => {
      if (!isRunningRef.current) return

      const now = Date.now()
      if (now - lastReactionTime < config.reactionDelay) return
      lastReactionTime = now

      // Игнорирует мяч
      if (Math.random() < config.ignoreChance) {
        setUpPressed(false)
        setDownPressed(false)
        console.log('AI: ignoring ball')
        return
      }

      let prediction = predictBallLandingY({
        ballX: ballX.current,
        ballY: ballY.current,
        ballSpeedX: ballSpeedX.current,
        ballSpeedY: ballSpeedY.current,
        targetX: paddleX,
      })

      console.log('AI prediction:', prediction)

      // Усталость
      fatigueCounter++
      if (fatigueCounter > 20) {
        fatigueLevel = Math.min(1, fatigueLevel + config.fatigueStep)
      } else {
        fatigueLevel = Math.max(0, fatigueLevel - config.fatigueRecovery)
      }

      // Промах
      let shouldMiss = Math.random() < config.mistakeChance
      let totalOffset = 0

      if (shouldMiss || fatigueLevel > 0) {
        const baseOffset = (Math.random() - 0.5) * 2 * config.maxOffset
        const fatigueOffset =
          fatigueLevel * config.maxOffset * (Math.random() - 0.5)
        totalOffset = baseOffset + fatigueOffset
        prediction += totalOffset
        console.log(
          `AI: ${shouldMiss ? 'mistake' : 'fatigued'}! Offset = ${Math.round(
            totalOffset
          )}`
        )
      }

      prediction = Math.max(
        BALL_SIZE,
        Math.min(CANVAS_HEIGHT - BALL_SIZE, prediction)
      )

      const paddleCenter = playerYRef.current + paddleHeight / 2

      if (paddleCenter < prediction - config.margin) {
        setUpPressed(false)
        setDownPressed(true)
        console.log('AI: move down')
      } else if (paddleCenter > prediction + config.margin) {
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
