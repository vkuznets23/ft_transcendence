import { useState, useRef, useCallback, useEffect } from 'react'
import { PADDLE_HEIGHT_MAP } from '../utils/constants'
import { generateRandomObstacle, Obstacle } from '../utils/generateObstacle'
import type {
  AIDifficultyOption,
  DifficultyOption,
  PaddleSizeOption,
  PlayerAliases,
  PlayerID,
  TournamentState,
} from '../types/types'

export function useGameState(canvasWidth: number, canvasHeight: number) {
  const [gameMode, setGameMode] = useState<'CasualGame' | 'tournament'>(
    'CasualGame'
  )
  const [errors, setErrors] = useState<Partial<PlayerAliases>>({})
  const [tournamentWins, setTournamentWins] = useState<
    Record<PlayerID, number>
  >({
    player1: 0,
    player2: 0,
    player3: 0,
    player4: 0,
  })
  const [tournamentWinner, setTournamentWinner] = useState<PlayerID | null>(
    null
  )
  const [playerAliases, setPlayerAliases] = useState<PlayerAliases>({
    player1: '',
    player2: '',
    player3: '',
    player4: '',
  })

  const [finalStandings, setFinalStandings] = useState<
    Record<'first' | 'second' | 'third' | 'fourth', PlayerID | null>
  >({
    first: null,
    second: null,
    third: null,
    fourth: null,
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
      { playerA: null, playerB: null, scoreA: 0, scoreB: 0, winner: null },
    ],
    currentMatchIndex: 0,
    finished: false,
  })
  const [showRoundResultModal, setShowRoundResultModal] = useState(false)
  const [roundWinner, setRoundWinner] = useState<PlayerID | null>(null)
  const currentMatchIndex = tournament.currentMatchIndex
  const currentMatch =
    currentMatchIndex >= 0 && currentMatchIndex < tournament.matches.length
      ? tournament.matches[currentMatchIndex]
      : null
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
      const semifinal1 = updatedMatches[0]
      const semifinal2 = updatedMatches[1]
      const thirdPlaceMatch = updatedMatches[2]
      const finalMatch = updatedMatches[3]

      if (semifinal1.winner && semifinal2.winner) {
        // 3d place
        updatedMatches[2] = {
          ...thirdPlaceMatch,
          playerA:
            semifinal1.playerA === semifinal1.winner
              ? semifinal1.playerB
              : semifinal1.playerA,
          playerB:
            semifinal2.playerA === semifinal2.winner
              ? semifinal2.playerB
              : semifinal2.playerA,
          winner: null,
          scoreA: 0,
          scoreB: 0,
        }
        // final
        updatedMatches[3] = {
          ...finalMatch,
          playerA: semifinal1.winner,
          playerB: semifinal2.winner,
          winner: null,
          scoreA: 0,
          scoreB: 0,
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
      let updatedTournament: TournamentState

      setTournament((prev) => {
        const matches = [...prev.matches]
        const index = prev.currentMatchIndex

        matches[index].winner = winner

        const finished = index === 3

        updatedTournament = {
          ...prev,
          matches,
          currentMatchIndex: index + 1,
          finished,
        }

        if (finished && matches[3].winner) {
          console.log('🏆 Final winner set:', matches[3].winner)
          setTournamentWinner(matches[3].winner)
        }

        return updatedTournament
      })

      // Сбросить очки и состояния
      setScore1State(0)
      setScore2State(0)
      setShowRoundResultModal(true)
    },
    []
  )

  useEffect(() => {
    if (tournament.finished) {
      const finalMatch = tournament.matches[3]
      const thirdPlaceMatch = tournament.matches[2]

      if (finalMatch.winner && thirdPlaceMatch.winner) {
        setFinalStandings({
          first: finalMatch.winner,
          second:
            finalMatch.playerA === finalMatch.winner
              ? finalMatch.playerB
              : finalMatch.playerA,
          third: thirdPlaceMatch.winner,
          fourth:
            thirdPlaceMatch.playerA === thirdPlaceMatch.winner
              ? thirdPlaceMatch.playerB
              : thirdPlaceMatch.playerA,
        })
      }
    }
  }, [tournament.finished, tournament.matches])

  const [currentPlayerA, setCurrentPlayerA] = useState<
    'player1' | 'player2' | 'player3' | 'player4' | undefined
  >(undefined)
  const [currentPlayerB, setCurrentPlayerB] = useState<
    'player1' | 'player2' | 'player3' | 'player4' | undefined
  >(undefined)

  useEffect(() => {
    if (currentMatch) {
      setCurrentPlayerA(currentMatch.playerA ?? undefined)
      setCurrentPlayerB(currentMatch.playerB ?? undefined)
    }
  }, [currentMatch])

  return {
    // States
    errors,
    setErrors,
    playerAliases,
    setPlayerAliases,
    setCurrentPlayerA,
    setCurrentPlayerB,
    finalStandings,
    setFinalStandings,
    tournamentWinner,
    setTournamentWinner,
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
