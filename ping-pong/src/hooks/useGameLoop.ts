import { useEffect } from 'react'

type GameLoopProps = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  isRunningRef: React.MutableRefObject<boolean>
  drawScene: (ctx: CanvasRenderingContext2D) => void
  updatePositions: () => void
  handleKeyDown: (e: KeyboardEvent) => void
  handleKeyUp: (e: KeyboardEvent) => void
}

export const useGameLoop = ({
  canvasRef,
  isRunningRef,
  drawScene,
  updatePositions,
  handleKeyDown,
  handleKeyUp,
}: GameLoopProps) => {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const gameLoop = () => {
      updatePositions()
      drawScene(ctx)
      animationFrameId = requestAnimationFrame(gameLoop)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    gameLoop()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [
    canvasRef,
    drawScene,
    updatePositions,
    handleKeyDown,
    handleKeyUp,
    isRunningRef,
  ])
}
