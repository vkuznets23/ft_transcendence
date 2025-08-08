import { useEffect, useRef } from 'react'
import { PlayerID } from '../types/types'
import { getPlayerImage } from './PlayersDisplay'
import { useFocusTrap } from '../hooks/useFocuseTrap'

export const TournamentWinnerModal = ({
  tournamentWinner,
  finalStandings,
  onPlayAgain,
}: {
  tournamentWinner: PlayerID | null
  finalStandings: {
    first: string | null
    second: string | null
    third: string | null
    fourth: string | null
  }
  onPlayAgain: () => void
}) => {
  const firstFocusableRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (tournamentWinner && firstFocusableRef.current) {
      firstFocusableRef.current.focus()
    }
  }, [tournamentWinner])
  const modalRef = useRef<HTMLDivElement>(null)
  useFocusTrap(
    modalRef as React.RefObject<HTMLElement>,
    Boolean(tournamentWinner)
  )

  if (!tournamentWinner) return null

  const renderPlayer = (
    label: string,
    playerId: string | null,
    medal: string,
    fontSizeClass: string
  ) => {
    if (!playerId) return null
    return (
      <li className="flex items-center gap-4 mb-6">
        <span className={`${fontSizeClass} `}>
          {medal} {label}: {playerId}
        </span>
        <img
          src={getPlayerImage(playerId)}
          alt={playerId}
          className="w-6 h-6 "
        />
      </li>
    )
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tournament-modal-title"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <div
        ref={modalRef}
        className="bg-gray-900 border-4 border-white-400 rounded-lg p-8 w-100 text-center text-white space-y-6"
      >
        <h2
          id="tournament-modal-title"
          className="w-full text-center text-3xl font-bold mb-4"
        >
          🏆 Tournament results
        </h2>

        <ul aria-label="Tournament final standings">
          {renderPlayer('1st place', finalStandings.first, '🥇', 'text-2xl')}
          {renderPlayer('2nd place', finalStandings.second, '🥈', 'text-xl')}
          {renderPlayer('3rd place', finalStandings.third, '🥉', 'text-lg')}
          {renderPlayer('4th place', finalStandings.fourth, '🎖️', 'text-base')}
        </ul>
        <button
          ref={firstFocusableRef}
          onClick={onPlayAgain}
          className="bg-yellow-400 w-full text-gray-900 font-semibold px-4 py-2 rounded hover:bg-yellow-300 transition"
          aria-label="Play tournament again"
        >
          Play again
        </button>
      </div>
    </div>
  )
}
