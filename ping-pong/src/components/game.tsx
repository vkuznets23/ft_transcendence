/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState } from 'react'

const PongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

  const update = () => {
    // Игрок 1 (слева) — W/S
    if (wPressed) player1Y.current -= 7
    if (sPressed) player1Y.current += 7
    player1Y.current = Math.max(
      Math.min(player1Y.current, canvasHeight - paddleHeight),
      0
    )

    // Игрок 2 (справа) — ↑/↓
    if (upPressed) player2Y.current -= 7
    if (downPressed) player2Y.current += 7
    player2Y.current = Math.max(
      Math.min(player2Y.current, canvasHeight - paddleHeight),
      0
    )

    // Движение мяча
    ballX.current += ballSpeedX.current
    ballY.current += ballSpeedY.current

    // Отскок от верх/низ
    if (
      ballY.current - ballSize < 0 ||
      ballY.current + ballSize > canvasHeight
    ) {
      ballSpeedY.current *= -1
    }

    // Отскок от ракетки игрока 1
    if (
      ballX.current - ballSize < paddleWidth &&
      ballY.current > player1Y.current &&
      ballY.current < player1Y.current + paddleHeight
    ) {
      ballSpeedX.current *= -1
      ballX.current = paddleWidth + ballSize
    }

    // Отскок от ракетки игрока 2
    if (
      ballX.current + ballSize > canvasWidth - paddleWidth &&
      ballY.current > player2Y.current &&
      ballY.current < player2Y.current + paddleHeight
    ) {
      ballSpeedX.current *= -1
      ballX.current = canvasWidth - paddleWidth - ballSize
    }

    // ГОЛ!
    if (ballX.current < 0) {
      score2.current += 1 // Игрок 2 забил
      resetBall()
    } else if (ballX.current > canvasWidth) {
      score1.current += 1 // Игрок 1 забил
      resetBall()
    }
  }

  const draw = (ctx: CanvasRenderingContext2D) => {
    // Очистка
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // Счёт
    ctx.fillStyle = 'white'
    ctx.font = '48px sans-serif'
    ctx.fillText(`${score1.current}`, canvasWidth / 4, 50)
    ctx.fillText(`${score2.current}`, (canvasWidth * 3) / 4, 50)

    // Ракетки
    ctx.fillRect(0, player1Y.current, paddleWidth, paddleHeight)
    ctx.fillRect(
      canvasWidth - paddleWidth,
      player2Y.current,
      paddleWidth,
      paddleHeight
    )

    // Мяч
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
      if (e.key === 'ArrowUp') setUpPressed(true)
      if (e.key === 'ArrowDown') setDownPressed(true)
      if (e.key.toLowerCase() === 'w') setWPressed(true)
      if (e.key.toLowerCase() === 's') setSPressed(true)
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') setUpPressed(false)
      if (e.key === 'ArrowDown') setDownPressed(false)
      if (e.key.toLowerCase() === 'w') setWPressed(false)
      if (e.key.toLowerCase() === 's') setSPressed(false)
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
  }, [upPressed, downPressed, wPressed, sPressed])

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      style={{
        border: '2px solid white',
        backgroundColor: 'black',
        display: 'block',
        margin: '0 auto',
      }}
    />
  )
}

export default PongGame
