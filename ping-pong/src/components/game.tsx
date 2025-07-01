import React, { useRef, useEffect, useState, useCallback } from 'react'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600

const PADDLE_WIDTH = 10
const BALL_SIZE = 10

const PADDLE_HEIGHT_MAP = {
  small: 60,
  medium: 100,
  large: 140,
} as const

type PaddleSizeOption = keyof typeof PADDLE_HEIGHT_MAP
type DifficultyOption = 'easy' | 'hard'

interface Obstacle {
  x: number
  y: number
  width: number
  height: number
}

const generateRandomObstacle = (): Obstacle => {
  const width = 30
  const height = 150
  const margin = 20
  const x = Math.random() * (CANVAS_WIDTH - width - margin * 2) + margin
  const y = Math.random() * (CANVAS_HEIGHT - height - margin * 2) + margin
  return { x, y, width, height }
}

const PongGame: React.FC = () => {
  // --- Refs для управления состоянием игры ---
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Клавиши для игроков
  const upPressed = useRef(false)
  const downPressed = useRef(false)
  const wPressed = useRef(false)
  const sPressed = useRef(false)

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
    generateRandomObstacle()
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
      setObstacle(generateRandomObstacle())
    }
  }, [difficulty])

  // Коллизия мяча с препятствием
  const checkBallObstacleCollision = useCallback(() => {
    const ballLeft = ballX.current - BALL_SIZE
    const ballRight = ballX.current + BALL_SIZE
    const ballTop = ballY.current - BALL_SIZE
    const ballBottom = ballY.current + BALL_SIZE

    const { x: ox, y: oy, width: ow, height: oh } = obstacle
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
      resetBall()
    } else if (ballX.current > CANVAS_WIDTH) {
      score1.current += 1
      resetBall()
    }
  }, [difficulty, resetBall, checkBallObstacleCollision])

  // Рисуем сцену
  const drawScene = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Счёт
      ctx.fillStyle = 'white'
      ctx.font = '48px sans-serif'
      ctx.fillText(`${score1.current}`, CANVAS_WIDTH / 4, 50)
      ctx.fillText(`${score2.current}`, (CANVAS_WIDTH * 3) / 4, 50)

      // Ракетки
      ctx.fillRect(0, player1Y.current, PADDLE_WIDTH, paddleHeightRef.current)
      ctx.fillRect(
        CANVAS_WIDTH - PADDLE_WIDTH,
        player2Y.current,
        PADDLE_WIDTH,
        paddleHeightRef.current
      )

      // Препятствие
      if (difficulty === 'hard') {
        ctx.fillStyle = 'red'
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
      }

      // Мяч
      ctx.fillStyle = 'white'
      ctx.beginPath()
      ctx.arc(ballX.current, ballY.current, BALL_SIZE, 0, Math.PI * 2)
      ctx.fill()
    },
    [difficulty, obstacle]
  )

  // Обработчики нажатия клавиш
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key.toLowerCase()) {
      case 'arrowup':
        upPressed.current = true
        break
      case 'arrowdown':
        downPressed.current = true
        break
      case 'w':
        wPressed.current = true
        break
      case 's':
        sPressed.current = true
        break
    }
  }, [])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    switch (e.key.toLowerCase()) {
      case 'arrowup':
        upPressed.current = false
        break
      case 'arrowdown':
        downPressed.current = false
        break
      case 'w':
        wPressed.current = false
        break
      case 's':
        sPressed.current = false
        break
    }
  }, [])

  // Основной цикл рендера и обновления
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    let animationFrameId: number

    const gameLoop = () => {
      updatePositions()
      drawScene(ctx)
      animationFrameId = requestAnimationFrame(gameLoop)
    }

    gameLoop()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp, updatePositions, drawScene])

  // Кнопка Старт/Пауза
  const toggleRunning = () => {
    setIsRunning((prev) => {
      const next = !prev
      isRunningRef.current = next
      if (next && difficulty === 'hard') {
        setObstacle(generateRandomObstacle())
      }
      return next
    })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-4">
      <div className="flex gap-6 items-center">
        <button
          onClick={toggleRunning}
          className="bg-white text-black px-5 py-2 rounded font-semibold hover:bg-gray-300 transition"
        >
          {isRunning ? 'Пауза' : 'Старт'}
        </button>

        <div>
          <label className="text-white mr-2">Размер ракетки:</label>
          <select
            value={paddleSizeOption}
            onChange={(e) =>
              setPaddleSizeOption(e.target.value as PaddleSizeOption)
            }
            disabled={isRunning}
            className="text-black rounded px-2 py-1"
          >
            <option value="small">Маленькая</option>
            <option value="medium">Средняя</option>
            <option value="large">Большая</option>
          </select>
        </div>

        <div>
          <label className="text-white mr-2">Сложность:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as DifficultyOption)}
            disabled={isRunning}
            className="text-black rounded px-2 py-1"
          >
            <option value="easy">Легко</option>
            <option value="hard">Сложно</option>
          </select>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border border-white rounded-md"
      />
    </div>
  )
}

export default PongGame
