import React, { useRef, useEffect, useState, useCallback } from 'react'
import GameSettingsModal from './TogglableModal'
import { generateRandomObstacle, Obstacle } from '../utils/generateObstacle'
import { useGameLoop } from '../hooks/useGameLoop'
import { usePlayerControls } from '../hooks/usePlayerControls'
import { drawScene as externalDrawScene } from '../utils/drawScene'
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PADDLE_WIDTH,
  BALL_SIZE,
  MAX_SCORE,
  PADDLE_HEIGHT_MAP,
} from '../utils/constants'

type PaddleSizeOption = keyof typeof PADDLE_HEIGHT_MAP
type DifficultyOption = 'easy' | 'hard'

const PongGame: React.FC = () => {
  const [showModal, setShowModal] = useState(true)
  const [gameOver, setGameOver] = useState(false)

  // --- Refs для управления состоянием игры ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Клавиши для игроков
  const {
    upPressed,
    downPressed,
    wPressed,
    sPressed,
    handleKeyDown,
    handleKeyUp,
  } = usePlayerControls()

  const isRunningRef = useRef(false)

  // Позиции и скорости
  const player1Y = useRef(CANVAS_HEIGHT / 2)
  const player2Y = useRef(CANVAS_HEIGHT / 2)

  const ballX = useRef(CANVAS_WIDTH / 2)
  const ballY = useRef(CANVAS_HEIGHT / 2)

  const ballSpeedX = useRef(5 * (Math.random() > 0.5 ? 1 : -1))
  const ballSpeedY = useRef(3 * (Math.random() > 0.5 ? 1 : -1))

  const score1 = useRef(0)
  const score2 = useRef(0)

  // --- Состояния для UI ---
  const [isRunning, setIsRunning] = useState(false)
  const [paddleSizeOption, setPaddleSizeOption] =
    useState<PaddleSizeOption>('medium')
  const [difficulty, setDifficulty] = useState<DifficultyOption>('easy')
  const [obstacle, setObstacle] = useState<Obstacle>(() =>
    generateRandomObstacle(CANVAS_WIDTH, CANVAS_HEIGHT)
  )

  // Текущий размер ракетки
  const paddleHeightRef = useRef(PADDLE_HEIGHT_MAP[paddleSizeOption])

  // Синхронизируем paddleHeight и позиции игроков при смене размера ракетки
  useEffect(() => {
    paddleHeightRef.current = PADDLE_HEIGHT_MAP[paddleSizeOption]
    player1Y.current = Math.min(
      player1Y.current,
      CANVAS_HEIGHT - paddleHeightRef.current
    )
    player2Y.current = Math.min(
      player2Y.current,
      CANVAS_HEIGHT - paddleHeightRef.current
    )
  }, [paddleSizeOption])

  // --- Основная логика ---

  // Сброс мяча в центр + рандомная скорость
  const resetBall = useCallback(() => {
    ballX.current = CANVAS_WIDTH / 2
    ballY.current = CANVAS_HEIGHT / 2
    ballSpeedX.current = 5 * (Math.random() > 0.5 ? 1 : -1)
    ballSpeedY.current = 3 * (Math.random() > 0.5 ? 1 : -1)

    if (difficulty === 'hard') {
      setObstacle(generateRandomObstacle(CANVAS_WIDTH, CANVAS_HEIGHT))
    }
  }, [difficulty])

  // Коллизия мяча с препятствием
  const checkBallObstacleCollision = useCallback(() => {
    const currentObstacle = obstacle

    const ballLeft = ballX.current - BALL_SIZE
    const ballRight = ballX.current + BALL_SIZE
    const ballTop = ballY.current - BALL_SIZE
    const ballBottom = ballY.current + BALL_SIZE

    const { x: ox, y: oy, width: ow, height: oh } = currentObstacle
    const obstacleLeft = ox
    const obstacleRight = ox + ow
    const obstacleTop = oy
    const obstacleBottom = oy + oh

    const isColliding =
      ballRight > obstacleLeft &&
      ballLeft < obstacleRight &&
      ballBottom > obstacleTop &&
      ballTop < obstacleBottom

    if (!isColliding) return

    const overlapLeft = ballRight - obstacleLeft
    const overlapRight = obstacleRight - ballLeft
    const overlapTop = ballBottom - obstacleTop
    const overlapBottom = obstacleBottom - ballTop

    const minOverlapX = Math.min(overlapLeft, overlapRight)
    const minOverlapY = Math.min(overlapTop, overlapBottom)

    if (minOverlapX < minOverlapY) {
      ballSpeedX.current *= -1
      if (overlapLeft < overlapRight) {
        ballX.current = obstacleLeft - BALL_SIZE
      } else {
        ballX.current = obstacleRight + BALL_SIZE
      }
    } else {
      ballSpeedY.current *= -1
      if (overlapTop < overlapBottom) {
        ballY.current = obstacleTop - BALL_SIZE
      } else {
        ballY.current = obstacleBottom + BALL_SIZE
      }
    }
  }, [obstacle])

  // Обновление позиции игроков и мяча
  const updatePositions = useCallback(() => {
    if (!isRunningRef.current) return

    // Игрок 1 - управление W/S
    if (wPressed.current) player1Y.current -= 7
    if (sPressed.current) player1Y.current += 7
    player1Y.current = Math.max(
      0,
      Math.min(player1Y.current, CANVAS_HEIGHT - paddleHeightRef.current)
    )

    // Игрок 2 - управление стрелками
    if (upPressed.current) player2Y.current -= 7
    if (downPressed.current) player2Y.current += 7
    player2Y.current = Math.max(
      0,
      Math.min(player2Y.current, CANVAS_HEIGHT - paddleHeightRef.current)
    )

    // Обновляем позицию мяча
    ballX.current += ballSpeedX.current
    ballY.current += ballSpeedY.current

    // Отскок от стен сверху/снизу
    if (
      ballY.current - BALL_SIZE < 0 ||
      ballY.current + BALL_SIZE > CANVAS_HEIGHT
    ) {
      ballSpeedY.current *= -1
    }

    // Отскок от ракеток
    if (
      ballX.current - BALL_SIZE < PADDLE_WIDTH &&
      ballY.current > player1Y.current &&
      ballY.current < player1Y.current + paddleHeightRef.current
    ) {
      ballSpeedX.current *= -1.05
      ballX.current = PADDLE_WIDTH + BALL_SIZE
    }

    if (
      ballX.current + BALL_SIZE > CANVAS_WIDTH - PADDLE_WIDTH &&
      ballY.current > player2Y.current &&
      ballY.current < player2Y.current + paddleHeightRef.current
    ) {
      ballSpeedX.current *= -1.05
      ballX.current = CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE
    }

    // Коллизия с препятствием (если сложно)
    if (difficulty === 'hard') {
      checkBallObstacleCollision()
    }

    // Голы
    if (ballX.current < 0) {
      score2.current += 1
      if (score2.current >= MAX_SCORE) {
        isRunningRef.current = false
        setIsRunning(false)
        setGameOver(true)
      } else {
        resetBall()
      }
    } else if (ballX.current > CANVAS_WIDTH) {
      score1.current += 1
      if (score1.current >= MAX_SCORE) {
        isRunningRef.current = false
        setIsRunning(false)
        setGameOver(true)
      } else {
        resetBall()
      }
    }
  }, [
    wPressed,
    sPressed,
    upPressed,
    downPressed,
    difficulty,
    checkBallObstacleCollision,
    resetBall,
  ])

  // Рисуем сцену
  const drawScene = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      externalDrawScene({
        ctx,
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        paddleWidth: PADDLE_WIDTH,
        paddleHeight: paddleHeightRef.current,
        ballSize: BALL_SIZE,
        score1: score1.current,
        score2: score2.current,
        player1Y: player1Y.current,
        player2Y: player2Y.current,
        ballX: ballX.current,
        ballY: ballY.current,
        difficulty,
        obstacle,
      })
    },
    [difficulty, obstacle]
  )

  // main loop of the game
  useGameLoop({
    canvasRef,
    isRunningRef,
    drawScene,
    updatePositions,
    handleKeyDown,
    handleKeyUp,
  })

  // Кнопка Старт/Пауза
  const toggleRunning = useCallback(() => {
    const next = !isRunningRef.current
    isRunningRef.current = next
    setIsRunning(next)
  }, [])

  const startGameFromModal = () => {
    score1.current = 0
    score2.current = 0
    setGameOver(false)
    setShowModal(false)
    resetBall()
    setTimeout(() => {
      toggleRunning()
    }, 100)
  }

  useEffect(() => {
    const handleSpaceToggle = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        if (!showModal) toggleRunning()
      }
    }

    window.addEventListener('keydown', handleSpaceToggle)
    return () => {
      window.removeEventListener('keydown', handleSpaceToggle)
    }
  }, [showModal, toggleRunning])

  return (
    <div className="flex flex-col items-center gap-6 p-6 min-h-screen">
      <div className="flex gap-4">
        <button
          onClick={toggleRunning}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={showModal}
        >
          {isRunning ? 'Pause' : 'Continue'}
        </button>
        <button
          onClick={() => {
            startGameFromModal()
            setShowModal(true)
          }}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition"
          disabled={showModal}
        >
          Restart
        </button>
      </div>

      <GameSettingsModal
        buttonText={gameOver ? 'Play Again' : 'Start the game'}
        show={showModal || gameOver}
        isRunning={isRunning}
        paddleSizeOption={paddleSizeOption}
        difficulty={difficulty}
        onPaddleSizeChange={setPaddleSizeOption}
        onDifficultyChange={setDifficulty}
        onStart={startGameFromModal}
      />

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-8 border-white p-4 rounded-md"
      />
    </div>
  )
}

export default PongGame
