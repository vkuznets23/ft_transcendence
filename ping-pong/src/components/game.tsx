import React, { useRef, useEffect, useState } from 'react'

const PongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Клавиши — теперь через useRef для мгновенного обновления
  const upPressed = useRef(false)
  const downPressed = useRef(false)
  const wPressed = useRef(false)
  const sPressed = useRef(false)

  const [isRunning, setIsRunning] = useState(false)
  const isRunningRef = useRef(false)

  // Кастомизация
  const [paddleSizeOption, setPaddleSizeOption] = useState<
    'small' | 'medium' | 'large'
  >('medium')

  // Уровень сложности
  const [difficulty, setDifficulty] = useState<'easy' | 'hard'>('easy')

  const canvasWidth = 800
  const canvasHeight = 600

  const paddleHeightMap = {
    small: 60,
    medium: 100,
    large: 140,
  }
  const paddleWidth = 10
  const ballSize = 10

  // Препятствие — посередине поля (будет использоваться только в сложном режиме)
  const obstacle = {
    x: canvasWidth / 2 - 55,
    y: canvasHeight / 2 - 75,
    width: 30,
    height: 150,
  }

  // Храним актуальный размер ракетки в ref
  const paddleHeightRef = useRef(paddleHeightMap[paddleSizeOption])

  // Обновляем paddleHeightRef при смене опции
  useEffect(() => {
    paddleHeightRef.current = paddleHeightMap[paddleSizeOption]

    // Корректируем позицию ракеток, чтобы не выйти за границы
    player1Y.current = Math.min(
      player1Y.current,
      canvasHeight - paddleHeightRef.current
    )
    player2Y.current = Math.min(
      player2Y.current,
      canvasHeight - paddleHeightRef.current
    )
  }, [paddleSizeOption])

  const player1Y = useRef(canvasHeight / 2 - paddleHeightRef.current / 2)
  const player2Y = useRef(canvasHeight / 2 - paddleHeightRef.current / 2)
  const ballX = useRef(canvasWidth / 2)
  const ballY = useRef(canvasHeight / 2)

  // Начальная скорость мяча
  const ballSpeedX = useRef(5 * (Math.random() > 0.5 ? 1 : -1))
  const ballSpeedY = useRef(3 * (Math.random() > 0.5 ? 1 : -1))

  // Сброс мяча
  const resetBall = () => {
    ballX.current = canvasWidth / 2
    ballY.current = canvasHeight / 2
    ballSpeedX.current = 5 * (Math.random() > 0.5 ? 1 : -1)
    ballSpeedY.current = 3 * (Math.random() > 0.5 ? 1 : -1)
  }

  const score1 = useRef(0)
  const score2 = useRef(0)

  // Основной игровой цикл
  const update = () => {
    if (!isRunningRef.current) return

    // Движение ракеток
    if (wPressed.current) player1Y.current -= 7
    if (sPressed.current) player1Y.current += 7
    player1Y.current = Math.max(
      0,
      Math.min(player1Y.current, canvasHeight - paddleHeightRef.current)
    )

    if (upPressed.current) player2Y.current -= 7
    if (downPressed.current) player2Y.current += 7
    player2Y.current = Math.max(
      0,
      Math.min(player2Y.current, canvasHeight - paddleHeightRef.current)
    )

    // Движение мяча
    ballX.current += ballSpeedX.current
    ballY.current += ballSpeedY.current

    // Отскок от верхнего и нижнего края
    if (
      ballY.current - ballSize < 0 ||
      ballY.current + ballSize > canvasHeight
    ) {
      ballSpeedY.current *= -1
    }

    // Отскок от ракеток
    if (
      ballX.current - ballSize < paddleWidth &&
      ballY.current > player1Y.current &&
      ballY.current < player1Y.current + paddleHeightRef.current
    ) {
      ballSpeedX.current *= -1.05
      ballX.current = paddleWidth + ballSize
    }

    if (
      ballX.current + ballSize > canvasWidth - paddleWidth &&
      ballY.current > player2Y.current &&
      ballY.current < player2Y.current + paddleHeightRef.current
    ) {
      ballSpeedX.current *= -1.05
      ballX.current = canvasWidth - paddleWidth - ballSize
    }

    // Отскок от препятствия, если включен режим hard
    if (difficulty === 'hard') {
      if (
        ballX.current + ballSize > obstacle.x &&
        ballX.current - ballSize < obstacle.x + obstacle.width &&
        ballY.current + ballSize > obstacle.y &&
        ballY.current - ballSize < obstacle.y + obstacle.height
      ) {
        // Проверяем откуда удар — по горизонтали или вертикали
        const overlapX =
          Math.min(ballX.current + ballSize, obstacle.x + obstacle.width) -
          Math.max(ballX.current - ballSize, obstacle.x)
        const overlapY =
          Math.min(ballY.current + ballSize, obstacle.y + obstacle.height) -
          Math.max(ballY.current - ballSize, obstacle.y)

        if (overlapX < overlapY) {
          // Отскок по горизонтали
          ballSpeedX.current *= -1
        } else {
          // Отскок по вертикали
          ballSpeedY.current *= -1
        }
      }
    }

    // Голы
    if (ballX.current < 0) {
      score2.current += 1
      resetBall()
    } else if (ballX.current > canvasWidth) {
      score1.current += 1
      resetBall()
    }
  }

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    ctx.fillStyle = 'white'
    ctx.font = '48px sans-serif'
    ctx.fillText(`${score1.current}`, canvasWidth / 4, 50)
    ctx.fillText(`${score2.current}`, (canvasWidth * 3) / 4, 50)

    ctx.fillRect(0, player1Y.current, paddleWidth, paddleHeightRef.current)
    ctx.fillRect(
      canvasWidth - paddleWidth,
      player2Y.current,
      paddleWidth,
      paddleHeightRef.current
    )

    // Рисуем препятствие только если сложность hard
    if (difficulty === 'hard') {
      ctx.fillStyle = 'red'
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
    }

    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.arc(ballX.current, ballY.current, ballSize, 0, Math.PI * 2)
    ctx.fill()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') upPressed.current = true
      if (e.key === 'ArrowDown') downPressed.current = true
      if (e.key.toLowerCase() === 'w') wPressed.current = true
      if (e.key.toLowerCase() === 's') sPressed.current = true
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') upPressed.current = false
      if (e.key === 'ArrowDown') downPressed.current = false
      if (e.key.toLowerCase() === 'w') wPressed.current = false
      if (e.key.toLowerCase() === 's') sPressed.current = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    let animationFrameId: number
    const render = () => {
      update()
      draw(ctx)
      animationFrameId = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [difficulty])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-4">
      <div className="flex gap-6 items-center">
        <button
          onClick={() => {
            setIsRunning((prev) => {
              isRunningRef.current = !prev
              return !prev
            })
          }}
          className="bg-white text-black px-6 py-2 rounded-md font-semibold shadow-md hover:bg-gray-300 transition"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>

        {/* Меню кастомизации */}
        <div className="flex gap-4 items-center text-white">
          <label>
            Ракетка:
            <select
              value={paddleSizeOption}
              onChange={(e) => setPaddleSizeOption(e.target.value as any)}
              className="ml-2 text-black rounded-md px-2 py-1"
            >
              <option value="small">Маленькая</option>
              <option value="medium">Средняя</option>
              <option value="large">Большая</option>
            </select>
          </label>

          <label>
            Сложность:
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="ml-2 text-black rounded-md px-2 py-1"
            >
              <option value="easy">Легко</option>
              <option value="hard">Сложно</option>
            </select>
          </label>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="border-2 border-white"
      />
    </div>
  )
}

export default PongGame
