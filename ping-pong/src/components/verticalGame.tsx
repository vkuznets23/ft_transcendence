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
import { useGameSounds } from '../hooks/useGameSounds'

const VERTICAL_CANVAS_WIDTH = CANVAS_HEIGHT
const VERTICAL_CANVAS_HEIGHT = CANVAS_WIDTH

const VerticalPongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [showModal, setShowModal] = useState(true)
  const [gameOver, setGameOver] = useState(false)
  const { playAddPoint, playGameOver, playGameStart, playPong } =
    useGameSounds()
  const [canvasSize, setCanvasSize] = useState({
    width: VERTICAL_CANVAS_WIDTH,
    height: VERTICAL_CANVAS_HEIGHT,
  })

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth

      // Максимальный размер канваса (ориентирован по ширине)
      const width = Math.min(screenWidth - 32, VERTICAL_CANVAS_WIDTH) - 10
      const height = (VERTICAL_CANVAS_HEIGHT / VERTICAL_CANVAS_WIDTH) * width

      setCanvasSize({ width, height })
    }

    handleResize() // вызываем сразу
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const [paddleSizeOption, setPaddleSizeOption] =
    useState<PaddleSizeOption>('medium')
  const [difficulty, setDifficulty] = useState<DifficultyOption>('easy')
  const [obstacle, setObstacle] = useState<Obstacle>(() =>
    generateRandomObstacle(canvasSize.width, canvasSize.height)
  )

  const paddleWidth = PADDLE_HEIGHT_MAP[paddleSizeOption]

  const isRunningRef = useRef(false)

  const toggleRunning = useCallback(() => {
    const next = !isRunningRef.current
    isRunningRef.current = next
    setIsRunning(next)
  }, [])

  const player1X = useRef(canvasSize.width / 2)
  const player2X = useRef(canvasSize.width / 2)

  const ballX = useRef(canvasSize.width / 2)
  const ballY = useRef(canvasSize.height / 2)

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
    ballX.current = canvasSize.width / 2
    ballY.current = canvasSize.height / 2
    ballSpeedX.current = 3 * (Math.random() > 0.5 ? 1 : -1)
    ballSpeedY.current = 5 * (Math.random() > 0.5 ? 1 : -1)

    if (difficulty === 'hard') {
      setObstacle(generateRandomObstacle(canvasSize.width, canvasSize.height))
    }
  }, [canvasSize.height, canvasSize.width, difficulty])

  const startGameFromModal = () => {
    playGameStart()
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
      playPong()

      if (overlapLeft < overlapRight) {
        ballX.current = obstacleLeft - BALL_SIZE
      } else {
        ballX.current = obstacleRight + BALL_SIZE
      }
    } else {
      ballSpeedY.current *= -1
      playPong()

      if (overlapTop < overlapBottom) {
        ballY.current = obstacleTop - BALL_SIZE
      } else {
        ballY.current = obstacleBottom + BALL_SIZE
      }
    }
  }, [obstacle, playPong])

  const updatePositions = useCallback(() => {
    if (!isRunningRef.current) return

    if (player1TouchX.current !== null) {
      player1X.current = Math.min(
        Math.max(player1TouchX.current - paddleWidth / 2, 0),
        canvasSize.width - paddleWidth
      )
    }

    if (player2TouchX.current !== null) {
      player2X.current = Math.min(
        Math.max(player2TouchX.current - paddleWidth / 2, 0),
        canvasSize.width - paddleWidth
      )
    }

    ballX.current += ballSpeedX.current
    ballY.current += ballSpeedY.current

    if (
      ballX.current - BALL_SIZE < 0 ||
      ballX.current + BALL_SIZE > canvasSize.width
    ) {
      ballSpeedX.current *= -1
      playPong()
    }

    if (
      ballY.current - BALL_SIZE < PADDLE_WIDTH &&
      ballX.current > player1X.current &&
      ballX.current < player1X.current + paddleWidth
    ) {
      ballSpeedY.current *= -1.05
      ballY.current = PADDLE_WIDTH + BALL_SIZE
      playPong()
    }

    if (
      ballY.current + BALL_SIZE > canvasSize.height - PADDLE_WIDTH &&
      ballX.current > player2X.current &&
      ballX.current < player2X.current + paddleWidth
    ) {
      ballSpeedY.current *= -1.05
      ballY.current = canvasSize.height - PADDLE_WIDTH - BALL_SIZE
      playPong()
    }

    if (difficulty === 'hard') {
      checkBallObstacleCollision()
    }

    if (ballY.current < 0) {
      score2.current += 1
      if (score2.current >= MAX_SCORE) {
        isRunningRef.current = false
        setIsRunning(false)
        playGameOver()
        setGameOver(true)
      } else {
        playAddPoint()
        resetBall()
      }
    } else if (ballY.current > canvasSize.height) {
      score1.current += 1
      if (score1.current >= MAX_SCORE) {
        isRunningRef.current = false
        setIsRunning(false)
        playGameOver()
        setGameOver(true)
      } else {
        playAddPoint()
        resetBall()
      }
    }
  }, [
    player1TouchX,
    player2TouchX,
    canvasSize.width,
    canvasSize.height,
    paddleWidth,
    difficulty,
    playPong,
    checkBallObstacleCollision,
    playGameOver,
    playAddPoint,
    resetBall,
  ])

  const drawScene = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      drawVerticalScene({
        ctx,
        width: canvasSize.width,
        height: canvasSize.height,
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
    [canvasSize.width, canvasSize.height, paddleWidth, difficulty, obstacle]
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
    <div className="flex items-center justify-center min-h-screen p-6 bg-black">
      <div className="flex flex-col items-center gap-6">
        <ControlsPanel
          isRunning={isRunning}
          onToggleRunning={toggleRunning}
          onRestart={() => {
            isRunningRef.current = false
            setIsRunning(false)
            setGameOver(false)
            setShowModal(true)
          }}
          disabled={showModal}
        />

        {/* <GameSettingsModal
          buttonText={gameOver ? 'Play Again' : 'Start the game'}
          show={showModal || gameOver}
          isRunning={isRunning}
          paddleSizeOption={paddleSizeOption}
          difficulty={difficulty}
          onPaddleSizeChange={setPaddleSizeOption}
          onDifficultyChange={setDifficulty}
          onStart={startGameFromModal}
        /> */}

        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="border-8 border-white rounded-md"
        />

        <ControlsPanel
          isRunning={isRunning}
          onToggleRunning={toggleRunning}
          onRestart={() => {
            isRunningRef.current = false
            setIsRunning(false)
            setGameOver(false)
            setShowModal(true)
          }}
          disabled={showModal}
        />
      </div>
    </div>
  )
}

export default VerticalPongGame
