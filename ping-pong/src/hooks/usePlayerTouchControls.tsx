import { useRef, useEffect } from 'react'

export const usePlayerTouchControls = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) => {
  const player1TouchX = useRef<number | null>(null)
  const player2TouchX = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i]
        const rect = canvas.getBoundingClientRect()
        const x = touch.clientX - rect.left
        const y = touch.clientY - rect.top

        // Если палец в верхней зоне — управляем верхней ракеткой
        if (y < rect.height / 2) {
          player1TouchX.current = x
        } else {
          player2TouchX.current = x
        }
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      // Если палец отпущен — сбросить позицию
      if (e.touches.length === 0) {
        player1TouchX.current = null
        player2TouchX.current = null
      }
    }

    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd)
    canvas.addEventListener('touchcancel', handleTouchEnd)

    return () => {
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
      canvas.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [canvasRef])

  return { player1TouchX, player2TouchX }
}
