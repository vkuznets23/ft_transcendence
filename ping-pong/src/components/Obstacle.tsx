import React, { useEffect, useState, useCallback } from 'react'
import { generateRandomObstacle, Obstacle } from '../utils/generateObstacle'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/constants'

type ObstacleManagerProps = {
  difficulty: 'easy' | 'hard'
  onObstacleChange: (obstacle: Obstacle) => void
}

const ObstacleManager: React.FC<ObstacleManagerProps> = ({
  difficulty,
  onObstacleChange,
}) => {
  const [obstacle, setObstacle] = useState<Obstacle | null>(null)

  const generateObstacle = useCallback(() => {
    const newObstacle = generateRandomObstacle(CANVAS_WIDTH, CANVAS_HEIGHT)
    setObstacle(newObstacle)
    onObstacleChange(newObstacle)
  }, [onObstacleChange])

  useEffect(() => {
    if (difficulty === 'hard') {
      generateObstacle()
    } else {
      setObstacle(null)
      onObstacleChange(null as any) // Можно заменить на Optional в типах
    }
  }, [difficulty, generateObstacle, onObstacleChange])

  if (difficulty !== 'hard') return null

  return (
    <div className="mb-4">
      {/* Можно отобразить информацию о текущей преграде */}
      {obstacle && (
        <p className="mt-2 text-white">
          Obstacle at ({obstacle.x.toFixed(0)},{obstacle.y.toFixed(0)}) size{' '}
          {obstacle.width}x{obstacle.height}
        </p>
      )}
    </div>
  )
}

export default ObstacleManager
