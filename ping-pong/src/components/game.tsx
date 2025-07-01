/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState } from 'react'

const PongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [isRunning, setIsRunning] = useState(false)
  const isRunningRef = useRef(false)

  // Хранение нажатий клавиш в ref для актуальности в update()
  const upPressedRef = useRef(false)
  const downPressedRef = useRef(false)
  const wPressedRef = useRef(false)
  const sPressedRef = useRef(false)

  // Состояния для отображения (опционально, можно убрать)
  const [upPressed, setUpPressed] = useState(false)
  const [downPressed, setDownPressed] = useState(false)
  const [wPressed, setWPressed] = useState(false)
  const [sPressed, setSPressed] = useState(false)

  const score1 = useRef(0)
  const score2 = useRef(0)

  const canvasWidth = 800
  const canvasHeight = 600
  const paddleHeight = 100
  const paddleWidth = 10
  const ballSize = 10

  const player1Y = useRef(canvasHeight / 2 - paddleHeight / 2)
  const player2Y = useRef(canvasHeight / 2 - paddleHeight / 2)
  const ballX = useRef(canvasWidth / 2)
  const ballY = useRef(canvasHeight / 2)
  const ballSpeedX = useRef(5)
  const ballSpeedY = useRef(3)

  const resetBall = () => {
    ballX.current = canvasWidth / 2
    ballY.current = canvasHeight / 2
    ballSpeedX.current = 5 * (Math.random() > 0.5 ? 1 : -1)
    ballSpeedY.current = 3 * (Math.random() > 0.5 ? 1 : -1)
  }

  const resetGame = () => {
    score1.current = 0
    score2.current = 0
    resetBall()
    player1Y.current = canvasHeight / 2 - paddleHeight / 2
    player2Y.current = canvasHeight / 2 - paddleHeight / 2
  }

  const update = () => {
    if (!isRunningRef.current) return

    // Используем refs, чтобы всегда иметь актуальные значения
    if (wPressedRef.current) player1Y.current -= 7
    if (sPressedRef.current) player1Y.current += 7
    player1Y.current = Math.max(
      Math.min(player1Y.current, canvasHeight - paddleHeight),
      0
    )

    if (upPressedRef.current) player2Y.current -= 7
    if (downPressedRef.current) player2Y.current += 7
    player2Y.current = Math.max(
      Math.min(player2Y.current, canvasHeight - paddleHeight),
      0
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
      ballY.current < player1Y.current + paddleHeight
    ) {
      ballSpeedX.current *= -1
      ballX.current = paddleWidth + ballSize
    }

    if (
      ballX.current + ballSize > canvasWidth - paddleWidth &&
      ballY.current > player2Y.current &&
      ballY.current < player2Y.current + paddleHeight
    ) {
      ballSpeedX.current *= -1
      ballX.current = canvasWidth - paddleWidth - ballSize
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

    ctx.fillRect(0, player1Y.current, paddleWidth, paddleHeight)
    ctx.fillRect(
      canvasWidth - paddleWidth,
      player2Y.current,
      paddleWidth,
      paddleHeight
    )

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
      if (e.key === 'ArrowUp') {
        setUpPressed(true)
        upPressedRef.current = true
      }
      if (e.key === 'ArrowDown') {
        setDownPressed(true)
        downPressedRef.current = true
      }
      if (e.key.toLowerCase() === 'w') {
        setWPressed(true)
        wPressedRef.current = true
      }
      if (e.key.toLowerCase() === 's') {
        setSPressed(true)
        sPressedRef.current = true
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setUpPressed(false)
        upPressedRef.current = false
      }
      if (e.key === 'ArrowDown') {
        setDownPressed(false)
        downPressedRef.current = false
      }
      if (e.key.toLowerCase() === 'w') {
        setWPressed(false)
        wPressedRef.current = false
      }
      if (e.key.toLowerCase() === 's') {
        setSPressed(false)
        sPressedRef.current = false
      }
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
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-4">
      <div className="flex gap-4">
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
        <button
          onClick={resetGame}
          className="bg-red-500 text-white px-6 py-2 rounded-md font-semibold shadow-md hover:bg-red-400 transition"
        >
          Reset
        </button>
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
