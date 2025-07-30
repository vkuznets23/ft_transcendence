import { useState, useRef, useCallback } from 'react'
import { PADDLE_HEIGHT_MAP } from '../utils/constants'
import { generateRandomObstacle, Obstacle } from '../utils/generateObstacle'
import {
  AIDifficultyOption,
  DifficultyOption,
  PaddleSizeOption,
} from '../components/game'

export function useGameState(canvasWidth: number, canvasHeight: number) {
  const [isRunning, setIsRunning] = useState(false)
  const [showModal, setShowModal] = useState(true)
  const [gameOver, setGameOver] = useState(false)
  const [opponentType, setOpponentType] = useState<'player' | 'ai'>('player')
  const [isSoundOn, setIsSoundOn] = useState(true)
  const [showPauseModal, setShowPauseModal] = useState(false)
  const [AIdifficulty, setAIDifficulty] = useState<AIDifficultyOption>('easy')
  const [paddleSizeOption, setPaddleSizeOption] =
    useState<PaddleSizeOption>('medium')
  const [difficulty, setDifficulty] = useState<DifficultyOption>('easy')

  const [score1State, setScore1State] = useState(0)
  const [score2State, setScore2State] = useState(0)

  const isRunningRef = useRef(false)
  const paddleHeightRef = useRef(PADDLE_HEIGHT_MAP[paddleSizeOption])

  const [obstacle, setObstacle] = useState<Obstacle | null>(() => {
    if (difficulty === 'medium' || difficulty === 'hard') {
      return generateRandomObstacle(canvasWidth, canvasHeight)
    }
    return null
  })

  const updatePaddleHeight = useCallback(() => {
    paddleHeightRef.current = PADDLE_HEIGHT_MAP[paddleSizeOption]
  }, [paddleSizeOption])

  return {
    // States
    isRunning,
    setIsRunning,
    showModal,
    setShowModal,
    gameOver,
    setGameOver,
    opponentType,
    setOpponentType,
    isSoundOn,
    setIsSoundOn,
    showPauseModal,
    setShowPauseModal,
    AIdifficulty,
    setAIDifficulty,
    paddleSizeOption,
    setPaddleSizeOption,
    difficulty,
    setDifficulty,
    score1State,
    setScore1State,
    score2State,
    setScore2State,
    obstacle,
    setObstacle,

    // Refs
    isRunningRef,
    paddleHeightRef,

    // Methods
    updatePaddleHeight,
  }
}
