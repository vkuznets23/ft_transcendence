import { DifficultyOption } from '../components/game'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './constants'
import { generateRandomObstacle, Obstacle } from './generateObstacle'

export const resetBall = (
  ballXRef: { current: number },
  ballYRef: { current: number },
  ballSpeedXRef: { current: number },
  ballSpeedYRef: { current: number },
  difficulty: DifficultyOption,
  setObstacle: React.Dispatch<React.SetStateAction<Obstacle>>,
  isRestart: boolean
) => {
  ballXRef.current = CANVAS_WIDTH / 2
  ballYRef.current = CANVAS_HEIGHT / 2
  ballSpeedXRef.current = 5 * (Math.random() > 0.5 ? 1 : -1)
  ballSpeedYRef.current = 3 * (Math.random() > 0.5 ? 1 : -1)

  if (isRestart && (difficulty === 'medium' || difficulty === 'hard')) {
    setObstacle(generateRandomObstacle(CANVAS_WIDTH, CANVAS_HEIGHT))
  }
}
