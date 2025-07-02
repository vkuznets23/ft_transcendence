export function checkBallObstacleCollision({
  ballX,
  ballY,
  ballRadius,
  obstacle,
}: {
  ballX: number
  ballY: number
  ballRadius: number
  obstacle: {
    x: number
    y: number
    width: number
    height: number
  }
}): boolean {
  return (
    ballX + ballRadius > obstacle.x &&
    ballX - ballRadius < obstacle.x + obstacle.width &&
    ballY + ballRadius > obstacle.y &&
    ballY - ballRadius < obstacle.y + obstacle.height
  )
}
