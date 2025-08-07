import { useCallback } from 'react'
import { PlayerID, TournamentState } from '../types/types'

type GameInitializerProps = {
  playGameStart: () => void
  resetPaddlesPosition: () => void
  setTournamentWinner: (value: React.SetStateAction<PlayerID | null>) => void
  setFinalStandings: (
    value: React.SetStateAction<
      Record<'first' | 'second' | 'third' | 'fourth', PlayerID | null>
    >
  ) => void
  setRoundWinner: (value: React.SetStateAction<PlayerID | null>) => void
  setShowPauseModal: (value: React.SetStateAction<boolean>) => void
  setShowRoundResultModal: (value: React.SetStateAction<boolean>) => void
  setTournamentWins: (
    value: React.SetStateAction<Record<PlayerID, number>>
  ) => void
  setOpponentType: (value: React.SetStateAction<'player' | 'ai'>) => void
  setTournament: (value: React.SetStateAction<TournamentState>) => void
  setCurrentPlayerA: (
    value: React.SetStateAction<
      'player1' | 'player2' | 'player3' | 'player4' | undefined
    >
  ) => void
  setCurrentPlayerB: (
    value: React.SetStateAction<
      'player1' | 'player2' | 'player3' | 'player4' | undefined
    >
  ) => void
  setGameOver: (value: React.SetStateAction<boolean>) => void
  setShowModal: (value: React.SetStateAction<boolean>) => void
  onResetBall: (isRestart?: boolean) => void
  setScore1State: (value: React.SetStateAction<number>) => void
  setScore2State: (value: React.SetStateAction<number>) => void
  toggleRunning: () => void
  score1Ref: React.RefObject<number>
  score2Ref: React.RefObject<number>
}
export const useGameInitializer = ({
  playGameStart,
  resetPaddlesPosition,
  setTournamentWinner,
  setFinalStandings,
  setRoundWinner,
  setShowPauseModal,
  setShowRoundResultModal,
  setTournamentWins,
  setOpponentType,
  setTournament,
  setCurrentPlayerA,
  setCurrentPlayerB,
  setGameOver,
  setShowModal,
  onResetBall,
  setScore1State,
  setScore2State,
  toggleRunning,
  score1Ref,
  score2Ref,
}: GameInitializerProps) => {
  return useCallback(
    (gameMode: string) => {
      playGameStart()

      setTournamentWinner(null)
      setFinalStandings({
        first: null,
        second: null,
        third: null,
        fourth: null,
      })
      setRoundWinner(null)
      setShowPauseModal(false)
      setShowRoundResultModal(false)

      if (gameMode === 'tournament') {
        setTournamentWins({ player1: 0, player2: 0, player3: 0, player4: 0 })
        setOpponentType('player')
        setTournament({
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
            {
              playerA: null,
              playerB: null,
              scoreA: 0,
              scoreB: 0,
              winner: null,
            },
            {
              playerA: null,
              playerB: null,
              scoreA: 0,
              scoreB: 0,
              winner: null,
            },
          ],
          currentMatchIndex: 0,
          finished: false,
        })
      }

      setCurrentPlayerA('player1')
      setCurrentPlayerB('player2')
      score1Ref.current = 0
      score2Ref.current = 0
      setScore1State(0)
      setScore2State(0)

      setGameOver(false)
      setShowModal(false)
      resetPaddlesPosition()
      onResetBall(true)

      setTimeout(() => {
        toggleRunning()
      }, 100)
    },
    [
      playGameStart,
      setTournamentWinner,
      setFinalStandings,
      setRoundWinner,
      setShowPauseModal,
      setShowRoundResultModal,
      setTournamentWins,
      setOpponentType,
      setTournament,
      setCurrentPlayerA,
      setCurrentPlayerB,
      setGameOver,
      setShowModal,
      resetPaddlesPosition,
      onResetBall,
      setScore1State,
      setScore2State,
      toggleRunning,
      score1Ref,
      score2Ref,
    ]
  )
}
