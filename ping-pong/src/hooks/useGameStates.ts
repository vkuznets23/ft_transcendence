import { useState, useRef, useCallback, useEffect } from 'react'
import { PADDLE_HEIGHT_MAP } from '../utils/constants'
import { generateRandomObstacle, Obstacle } from '../utils/generateObstacle'
import type {
  AIDifficultyOption,
  DifficultyOption,
  PaddleSizeOption,
  PlayerID,
  TournamentState,
} from '../types/types'

export function useGameState(canvasWidth: number, canvasHeight: number) {
  const [gameMode, setGameMode] = useState<'CasualGame' | 'tournament'>(
    'CasualGame'
  )
  const [tournamentWins, setTournamentWins] = useState<
    Record<PlayerID, number>
  >({
    player1: 0,
    player2: 0,
    player3: 0,
    player4: 0,
  })

  const [tournament, setTournament] = useState<TournamentState>({
    matches: [
      {
        playerA: 'player1',
        playerB: 'player2',
        scoreA: 0,
        scoreB: 0,
        winner: null,
      },
      {
        playerA: 'player3',
        playerB: 'player4',
        scoreA: 0,
        scoreB: 0,
        winner: null,
      },
      { playerA: null, playerB: null, scoreA: 0, scoreB: 0, winner: null },
    ],
    currentMatchIndex: 0,
    finished: false,
  })
  const [showRoundResultModal, setShowRoundResultModal] = useState(false)
  const [roundWinner, setRoundWinner] = useState<'player1' | 'player2' | null>(
    null
  )
  const currentMatchIndex = tournament.currentMatchIndex
  const currentMatch =
    currentMatchIndex >= 0 && currentMatchIndex < tournament.matches.length
      ? tournament.matches[currentMatchIndex]
      : null

  // const [currentRound, setCurrentRound] = useState(1)
  // const [totalRounds, setTotalRounds] = useState(3)

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

  useEffect(() => {
    setTournament((prev) => {
      const updatedMatches = [...prev.matches]
      const [semifinal1, semifinal2, finalMatch] = updatedMatches

      if (
        semifinal1.winner &&
        semifinal2.winner &&
        (!finalMatch.playerA || !finalMatch.playerB)
      ) {
        updatedMatches[2] = {
          ...finalMatch,
          playerA: semifinal1.winner,
          playerB: semifinal2.winner,
        }

        return {
          ...prev,
          matches: updatedMatches,
        }
      }

      return prev
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournament.matches[0].winner, tournament.matches[1].winner])

  const finishCurrentMatch = useCallback(
    (winner: 'player1' | 'player2' | 'player3' | 'player4') => {
      setTournament((prev) => {
        const matches = [...prev.matches]
        const index = prev.currentMatchIndex

        matches[index].winner = winner

        return {
          ...prev,
          matches,
          currentMatchIndex: index + 1,
          finished: index === 2,
        }
      })

      // Сбросить очки и состояния
      setScore1State(0)
      setScore2State(0)
      setRoundWinner(null)
      setShowRoundResultModal(true)
    },
    []
  )

  const currentPlayerA = currentMatch?.playerA
  const currentPlayerB = currentMatch?.playerB

  return {
    // States
    currentPlayerA,
    currentPlayerB,
    tournamentWins,
    setTournamentWins,
    showRoundResultModal,
    setShowRoundResultModal,
    roundWinner,
    setRoundWinner,
    tournament,
    finishCurrentMatch,
    setTournament,
    currentMatch,
    gameMode,
    setGameMode,
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
