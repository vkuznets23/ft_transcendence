import React, { useRef, useEffect, useState } from 'react'

const PongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const upPressed = useRef(false)
  const downPressed = useRef(false)
  const wPressed = useRef(false)
  const sPressed = useRef(false)

  const [isRunning, setIsRunning] = useState(false)
  const isRunningRef = useRef(false)

  const [paddleSizeOption, setPaddleSizeOption] = useState<
    'small' | 'medium' | 'large'
  >('medium')
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

  const paddleHeightRef = useRef(paddleHeightMap[paddleSizeOption])

  // Препятствие — теперь в состоянии
  const [obstacle, setObstacle] = useState({
    x: canvasWidth / 2 - 55,
    y: canvasHeight / 2 - 75,
    width: 30,
    height: 150,
  })

  const generateRandomObstacle = () => {
    const width = 30
    const height = 150
    const margin = 20
    const x = Math.random() * (canvasWidth - width - margin * 2) + margin
    const y = Math.random() * (canvasHeight - height - margin * 2) + margin
    return { x, y, width, height }
  }

  useEffect(() => {
    paddleHeightRef.current = paddleHeightMap[paddleSizeOption]
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

  const ballSpeedX = useRef(5 * (Math.random() > 0.5 ? 1 : -1))
  const ballSpeedY = useRef(3 * (Math.random() > 0.5 ? 1 : -1))

  const score1 = useRef(0)
  const score2 = useRef(0)

  const resetBall = () => {
    ballX.current = canvasWidth / 2
    ballY.current = canvasHeight / 2
    ballSpeedX.current = 5 * (Math.random() > 0.5 ? 1 : -1)
    ballSpeedY.current = 3 * (Math.random() > 0.5 ? 1 : -1)

    if (difficulty === 'hard') {
      setObstacle(generateRandomObstacle())
    }
  }

  const update = () => {
    if (!isRunningRef.current) return

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

    ballX.current += ballSpeedX.current
    ballY.current += ballSpeedY.current

    if (
      ballY.current - ballSize < 0 ||
      ballY.current + ballSize > canvasHeight
    ) {
      ballSpeedY.current *= -1
    }

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

    // if (difficulty === 'hard') {
    //   if (
    //     ballX.current + ballSize > obstacle.x &&
    //     ballX.current - ballSize < obstacle.x + obstacle.width &&
    //     ballY.current + ballSize > obstacle.y &&
    //     ballY.current - ballSize < obstacle.y + obstacle.height
    //   ) {
    //     const overlapX =
    //       Math.min(ballX.current + ballSize, obstacle.x + obstacle.width) -
    //       Math.max(ballX.current - ballSize, obstacle.x)
    //     const overlapY =
    //       Math.min(ballY.current + ballSize, obstacle.y + obstacle.height) -
    //       Math.max(ballY.current - ballSize, obstacle.y)

    //     if (overlapX < overlapY) {
    //       ballSpeedX.current *= -1
    //     } else {
    //       ballSpeedY.current *= -1
    //     }
    //   }
    // }

    if (difficulty === 'hard') {
      const ballLeft = ballX.current - ballSize
      const ballRight = ballX.current + ballSize
      const ballTop = ballY.current - ballSize
      const ballBottom = ballY.current + ballSize

      const obstacleLeft = obstacle.x
      const obstacleRight = obstacle.x + obstacle.width
      const obstacleTop = obstacle.y
      const obstacleBottom = obstacle.y + obstacle.height

      const isColliding =
        ballRight > obstacleLeft &&
        ballLeft < obstacleRight &&
        ballBottom > obstacleTop &&
        ballTop < obstacleBottom

      if (isColliding) {
        const overlapLeft = ballRight - obstacleLeft
        const overlapRight = obstacleRight - ballLeft
        const overlapTop = ballBottom - obstacleTop
        const overlapBottom = obstacleBottom - ballTop

        const minOverlapX = Math.min(overlapLeft, overlapRight)
        const minOverlapY = Math.min(overlapTop, overlapBottom)

        // Отскок по самой маленькой оси проникновения
        if (minOverlapX < minOverlapY) {
          // Горизонтальный отскок
          ballSpeedX.current *= -1

          if (overlapLeft < overlapRight) {
            ballX.current = obstacleLeft - ballSize
          } else {
            ballX.current = obstacleRight + ballSize
          }
        } else {
          // Вертикальный отскок
          ballSpeedY.current *= -1

          if (overlapTop < overlapBottom) {
            ballY.current = obstacleTop - ballSize
          } else {
            ballY.current = obstacleBottom + ballSize
          }
        }
      }
    }

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
              const next = !prev
              isRunningRef.current = next
              return next
            })

            // Рандомизируем препятствие при старте, если нужно
            if (!isRunning && difficulty === 'hard') {
              setObstacle(generateRandomObstacle())
            }
          }}
          className="bg-white text-black px-6 py-2 rounded-md font-semibold shadow-md hover:bg-gray-300 transition"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>

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
