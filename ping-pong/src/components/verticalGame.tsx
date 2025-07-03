import React, { useRef, useCallback, useState, useEffect } from 'react'
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PADDLE_WIDTH,
  BALL_SIZE,
  MAX_SCORE,
  PADDLE_HEIGHT_MAP,
} from '../utils/constants'
import { Obstacle, generateRandomObstacle } from '../utils/generateObstacle'
import { useGameLoop } from '../hooks/useGameLoop'
import { usePlayerTouchControls } from '../hooks/usePlayerTouchControls'
import { drawVerticalScene } from '../utils/drawVerticalScene'
import ControlsPanel from './ControllsPannel'
import GameSettingsModal from './TogglableModal'
import { DifficultyOption, PaddleSizeOption } from './game'

const VERTICAL_CANVAS_WIDTH = CANVAS_HEIGHT
const VERTICAL_CANVAS_HEIGHT = CANVAS_WIDTH

const VerticalPongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [showModal, setShowModal] = useState(true)
  const [gameOver, setGameOver] = useState(false)

  const [paddleSizeOption, setPaddleSizeOption] =
    useState<PaddleSizeOption>('medium')
  const [difficulty, setDifficulty] = useState<DifficultyOption>('easy')
  const [obstacle, setObstacle] = useState<Obstacle>(() =>
    generateRandomObstacle(CANVAS_WIDTH, CANVAS_HEIGHT)
  )

  const paddleWidth = PADDLE_HEIGHT_MAP[paddleSizeOption]

  const isRunningRef = useRef(false)

  const toggleRunning = useCallback(() => {
    const next = !isRunningRef.current
    isRunningRef.current = next
    setIsRunning(next)
  }, [])

  console.log('Generated obstacle:', obstacle)

  const player1X = useRef(VERTICAL_CANVAS_WIDTH / 2)
  const player2X = useRef(VERTICAL_CANVAS_WIDTH / 2)

  const ballX = useRef(VERTICAL_CANVAS_WIDTH / 2)
  const ballY = useRef(VERTICAL_CANVAS_HEIGHT / 2)

  const ballSpeedX = useRef(3 * (Math.random() > 0.5 ? 1 : -1))
  const ballSpeedY = useRef(5 * (Math.random() > 0.5 ? 1 : -1))

  const score1 = useRef(0)
  const score2 = useRef(0)

  const { player1TouchX, player2TouchX } = usePlayerTouchControls(canvasRef)

  const paddleHeightRef = useRef(PADDLE_HEIGHT_MAP[paddleSizeOption])

  useEffect(() => {
    paddleHeightRef.current = PADDLE_HEIGHT_MAP[paddleSizeOption]
    player1X.current = Math.min(
      player1X.current,
      CANVAS_HEIGHT - paddleHeightRef.current
    )
    player2X.current = Math.min(
      player2X.current,
      CANVAS_HEIGHT - paddleHeightRef.current
    )
  }, [paddleSizeOption])

  const resetBall = useCallback(() => {
    ballX.current = VERTICAL_CANVAS_WIDTH / 2
    ballY.current = VERTICAL_CANVAS_HEIGHT / 2
    ballSpeedX.current = 3 * (Math.random() > 0.5 ? 1 : -1)
    ballSpeedY.current = 5 * (Math.random() > 0.5 ? 1 : -1)

    if (difficulty === 'hard') {
      setObstacle(generateRandomObstacle(CANVAS_WIDTH, CANVAS_HEIGHT))
    }
  }, [difficulty])

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

  const updatePositions = useCallback(() => {
    if (!isRunningRef.current) return

    if (player1TouchX.current !== null) {
      player1X.current = Math.min(
        Math.max(player1TouchX.current - paddleWidth / 2, 0),
        VERTICAL_CANVAS_WIDTH - paddleWidth
      )
    }

    if (player2TouchX.current !== null) {
      player2X.current = Math.min(
        Math.max(player2TouchX.current - paddleWidth / 2, 0),
        VERTICAL_CANVAS_WIDTH - paddleWidth
      )
    }

    ballX.current += ballSpeedX.current
    ballY.current += ballSpeedY.current

    if (
      ballX.current - BALL_SIZE < 0 ||
      ballX.current + BALL_SIZE > VERTICAL_CANVAS_WIDTH
    ) {
      ballSpeedX.current *= -1
    }

    if (
      ballY.current - BALL_SIZE < PADDLE_WIDTH &&
      ballX.current > player1X.current &&
      ballX.current < player1X.current + paddleWidth
    ) {
      ballSpeedY.current *= -1.05
      ballY.current = PADDLE_WIDTH + BALL_SIZE
    }

    if (
      ballY.current + BALL_SIZE > VERTICAL_CANVAS_HEIGHT - PADDLE_WIDTH &&
      ballX.current > player2X.current &&
      ballX.current < player2X.current + paddleWidth
    ) {
      ballSpeedY.current *= -1.05
      ballY.current = VERTICAL_CANVAS_HEIGHT - PADDLE_WIDTH - BALL_SIZE
    }

    // ✅ Препятствие (если режим hard)
    if (difficulty === 'hard') {
      checkBallObstacleCollision()
    }

    if (ballY.current < 0) {
      score2.current += 1
      if (score2.current >= MAX_SCORE) {
        isRunningRef.current = false
        setIsRunning(false)
        setGameOver(true)
      } else {
        resetBall()
      }
    } else if (ballY.current > VERTICAL_CANVAS_HEIGHT) {
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
    player1TouchX,
    player2TouchX,
    paddleWidth,
    difficulty,
    checkBallObstacleCollision,
    resetBall,
  ])

  const drawScene = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      drawVerticalScene({
        ctx,
        width: VERTICAL_CANVAS_WIDTH,
        height: VERTICAL_CANVAS_HEIGHT,
        paddleWidth,
        ballSize: BALL_SIZE,
        score1: score1.current,
        score2: score2.current,
        player1X: player1X.current,
        player2X: player2X.current,
        ballX: ballX.current,
        ballY: ballY.current,
        difficulty,
        obstacle,
      })
    },
    [paddleWidth, difficulty, obstacle]
  )

  useGameLoop({
    canvasRef,
    isRunningRef,
    drawScene,
    updatePositions,
    handleKeyDown: () => {},
    handleKeyUp: () => {},
  })

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <ControlsPanel
        isRunning={isRunning}
        onToggleRunning={toggleRunning}
        onRestart={() => {
          startGameFromModal()
          setShowModal(true)
        }}
        disabled={showModal}
      />

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
        width={VERTICAL_CANVAS_WIDTH}
        height={VERTICAL_CANVAS_HEIGHT}
        style={{ border: '4px solid white', backgroundColor: '#1a1a1a' }}
      />
    </div>
  )
}

export default VerticalPongGame
