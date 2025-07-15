/* eslint-disable react-hooks/exhaustive-deps */
import player1 from '../assets/images/playerLeft.png'
import player2 from '../assets/images/playerRight.png'
import playerAI from '../assets/images/playerAI.png'
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
  MAX_SPEED,
} from '../utils/constants'
import ControlsPanel from './ControllsPannel'
import { resetBall } from '../utils/resetBall'
import { useGameSounds } from '../hooks/useGameSounds'
import { useAIPlayer } from '../hooks/useAIPlayer'
import { HeartDisplay } from './Heartdisplay'

export type PaddleSizeOption = keyof typeof PADDLE_HEIGHT_MAP
export type DifficultyOption = 'easy' | 'medium' | 'hard'
export type AIDifficultyOption = 'easy' | 'hard'

const PongGame: React.FC = () => {
  const [showModal, setShowModal] = useState(true)
  const [gameOver, setGameOver] = useState(false)
  const [isSoundOn, setIsSoundOn] = useState(true)
  const [showPauseModal, setShowPauseModal] = useState(false)

  const { playAddPoint, playGameOver, playGameStart, playPong } =
    useGameSounds(isSoundOn)

  const [opponentType, setOpponentType] = useState<'player' | 'ai'>('player')

  const [score1State, setScore1State] = useState(0)
  const [score2State, setScore2State] = useState(0)

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

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  const isRunningRef = useRef(false)

  const aiUpPressedRef = useRef(false)
  const aiDownPressedRef = useRef(false)

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
  const [AIdifficulty, setAIDifficulty] = useState<AIDifficultyOption>('easy')
  const [obstacle, setObstacle] = useState<Obstacle>(() =>
    generateRandomObstacle(CANVAS_WIDTH, CANVAS_HEIGHT)
  )

  // Текущий размер ракетки
  const paddleHeightRef = useRef(PADDLE_HEIGHT_MAP[paddleSizeOption])

  const rightPaddleYRef = player2Y
  const rightPaddleHeight = paddleHeightRef.current

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

  useEffect(() => {
    if (difficulty !== 'hard') return

    let intervalId: NodeJS.Timeout | null = null

    const maybeStartInterval = () => {
      if (isRunningRef.current) {
        intervalId = setInterval(() => {
          setObstacle(generateRandomObstacle(CANVAS_WIDTH, CANVAS_HEIGHT))
        }, 3000)
      }
    }

    maybeStartInterval()

    // Очистка при размонтировании или при изменении состояния
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [difficulty, isRunning])

  // --- Основная логика ---

  // Сброс мяча в центр + рандомная скорость
  const onResetBall = useCallback(
    (isRestart = false) => {
      resetBall(
        ballX,
        ballY,
        ballSpeedX,
        ballSpeedY,
        difficulty,
        setObstacle,
        isRestart
      )
    },
    [difficulty, setObstacle]
  )

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
      if (Math.abs(ballSpeedX.current) > MAX_SPEED) {
        ballSpeedX.current = MAX_SPEED * Math.sign(ballSpeedX.current)
      }
      playPong()

      if (overlapLeft < overlapRight) {
        ballX.current = obstacleLeft - BALL_SIZE
      } else {
        ballX.current = obstacleRight + BALL_SIZE
      }
    } else {
      ballSpeedY.current *= -1
      if (Math.abs(ballSpeedX.current) > MAX_SPEED) {
        ballSpeedX.current = MAX_SPEED * Math.sign(ballSpeedX.current)
      }
      playPong()

      if (overlapTop < overlapBottom) {
        ballY.current = obstacleTop - BALL_SIZE
      } else {
        ballY.current = obstacleBottom + BALL_SIZE
      }
    }
  }, [obstacle, playPong])

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
    if (opponentType === 'player') {
      if (upPressed.current) player2Y.current -= 7
      if (downPressed.current) player2Y.current += 7
      player2Y.current = Math.max(
        0,
        Math.min(player2Y.current, CANVAS_HEIGHT - paddleHeightRef.current)
      )
    }

    if (opponentType === 'ai') {
      if (aiUpPressedRef.current) player2Y.current -= 7
      if (aiDownPressedRef.current) player2Y.current += 7

      // Ограничение позиции
      player2Y.current = Math.max(
        0,
        Math.min(player2Y.current, CANVAS_HEIGHT - paddleHeightRef.current)
      )
    }

    // Обновляем позицию мяча
    ballX.current += ballSpeedX.current
    ballY.current += ballSpeedY.current

    // Отскок от стен сверху/снизу
    if (
      ballY.current - BALL_SIZE < 0 ||
      ballY.current + BALL_SIZE > CANVAS_HEIGHT
    ) {
      ballSpeedY.current *= -1
      if (Math.abs(ballSpeedX.current) > MAX_SPEED) {
        ballSpeedX.current = MAX_SPEED * Math.sign(ballSpeedX.current)
      }
      playPong()
    }

    // Отскок от ракеток
    if (
      ballX.current - BALL_SIZE < PADDLE_WIDTH &&
      ballY.current > player1Y.current &&
      ballY.current < player1Y.current + paddleHeightRef.current
    ) {
      ballSpeedX.current *= -1.05
      if (Math.abs(ballSpeedX.current) > MAX_SPEED) {
        ballSpeedX.current = MAX_SPEED * Math.sign(ballSpeedX.current)
      }
      ballX.current = PADDLE_WIDTH + BALL_SIZE
      playPong()
    }

    if (
      ballX.current + BALL_SIZE > CANVAS_WIDTH - PADDLE_WIDTH &&
      ballY.current > player2Y.current &&
      ballY.current < player2Y.current + paddleHeightRef.current
    ) {
      ballSpeedX.current *= -1.05
      if (Math.abs(ballSpeedX.current) > MAX_SPEED) {
        ballSpeedX.current = MAX_SPEED * Math.sign(ballSpeedX.current)
      }
      ballX.current = CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE
      playPong()
    }

    // Коллизия с препятствием (если сложно)
    if (difficulty === 'hard' || difficulty === 'medium') {
      checkBallObstacleCollision()
    }

    // Голы
    if (ballX.current < 0) {
      score2.current += 1
      setScore2State(score2.current)

      if (score2.current >= MAX_SCORE) {
        isRunningRef.current = false
        setIsRunning(false)
        playGameOver()
        setGameOver(true)
      } else {
        playAddPoint()
        onResetBall()
      }
    } else if (ballX.current > CANVAS_WIDTH) {
      score1.current += 1
      setScore1State(score1.current)
      if (score1.current >= MAX_SCORE) {
        isRunningRef.current = false
        setIsRunning(false)
        playGameOver()
        setGameOver(true)
      } else {
        playAddPoint()
        onResetBall()
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
    opponentType,
    playPong,
    playAddPoint,
    playGameOver,
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
    [obstacle, difficulty]
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
    if (!next) {
      // Если поставили игру на паузу — показать модалку
      setShowPauseModal(true)
    } else {
      // Если возобновляем игру — скрыть модалку
      setShowPauseModal(false)
    }
  }, [])

  const handleContinueFromPause = () => {
    setShowPauseModal(false)
    toggleRunning()
  }

  const startGameFromModal = () => {
    playGameStart()
    score1.current = 0
    score2.current = 0
    setGameOver(false)
    setShowModal(false)
    onResetBall(true)
    setScore1State(0)
    setScore2State(0)
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

  useAIPlayer({
    isRunningRef,
    AIdifficulty,
    playerYRef: rightPaddleYRef,
    paddleHeight: rightPaddleHeight,
    ballX,
    ballY,
    ballSpeedX,
    ballSpeedY,
    setUpPressed: (val) => {
      console.log('AI setUpPressed', val)
      aiUpPressedRef.current = val
    },
    setDownPressed: (val) => {
      console.log('AI setDownPressed', val)
      aiDownPressedRef.current = val
    },
    enabled: opponentType === 'ai',
  })

  return (
    <div className="flex flex-col items-center gap-6 p-6 min-h-screen">
      <GameSettingsModal
        buttonText={gameOver ? 'Play Again' : 'Start the game'}
        show={showModal || gameOver}
        isRunning={isRunning}
        paddleSizeOption={paddleSizeOption}
        difficulty={difficulty}
        AIdifficulty={AIdifficulty}
        opponentType={opponentType}
        onOpponentTypeChange={setOpponentType}
        onPaddleSizeChange={setPaddleSizeOption}
        onDifficultyChange={setDifficulty}
        onAIDifficultyChange={setAIDifficulty}
        onStart={startGameFromModal}
      />

      <div className="flex items-center gap-10">
        <div className="flex items-center gap-5">
          <img
            src={player1}
            alt="player1"
            className="flex justify-start h-[40px]"
          />
          <HeartDisplay score={score2State} player="left" />
        </div>
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
        {showPauseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
            <div>
              <button
                onClick={handleContinueFromPause}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md"
              >
                Continue
              </button>
            </div>
          </div>
        )}
        <button
          className="flex items-center  px-4 py-2 bg-gray-700 text-white rounded"
          onClick={() => setIsSoundOn((prev) => !prev)}
        >
          {isSoundOn ? 'Sounds on' : 'Sounds off'}
        </button>
        <div className="flex items-center gap-5">
          <HeartDisplay score={score1State} player="right" />
          {opponentType === 'ai' ? (
            <img
              src={playerAI}
              alt="player AI"
              className="flex justify-start h-[40px]"
            />
          ) : (
            <img
              src={player2}
              alt="player2"
              className="flex justify-start h-[40px]"
            />
          )}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-8 border-white  rounded-md"
      />
    </div>
  )
}

export default PongGame
