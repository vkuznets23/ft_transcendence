import { useEffect, useRef } from 'react'
import { PlayerID } from '../types/types'
import { getPlayerImage } from './PlayersDisplay'
import { useFocusTrap } from '../hooks/useFocuseTrap'
import { useTextSize } from '../context/fontGlobal'

export const TournamentWinnerModal = ({
  tournamentWinner,
  finalStandings,
  onPlayAgain,
  playerAliases,
}: {
  tournamentWinner: PlayerID | null
  finalStandings: {
    first: string | null
    second: string | null
    third: string | null
    fourth: string | null
  }
  onPlayAgain: () => void
  playerAliases: Record<string, string>
}) => {
  const { textSize, textClass } = useTextSize()
  const uniqueHeadingClass = {
    small: 'text-xl',
    medium: 'text-3xl',
    large: 'text-5xl',
  }[textSize]

  const unique1stClass = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl',
  }[textSize]

  const unique2ndClass = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl',
  }[textSize]

  const unique3dClass = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-xl',
  }[textSize]

  const unique4thClass = {
    small: 'text-xs',
    medium: 'text-base',
    large: 'text-sm',
  }[textSize]

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
    const alias = playerAliases[playerId] ?? playerId
    return (
      <li className="flex items-center gap-4 mb-6">
        <span className={`${fontSizeClass} `}>
          {medal} {label}: {alias}
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
        tabIndex={-1}
        className="bg-gray-900 border-4 border-white-400 rounded-lg p-8 w-100 text-center text-white space-y-6"
      >
        <h2
          id="tournament-modal-title"
          className={`${uniqueHeadingClass} w-full text-center font-bold mb-4`}
        >
          🏆 Tournament results
        </h2>

        <ul aria-label="Tournament final standings">
          {renderPlayer(
            '1st place',
            finalStandings.first,
            '🥇',
            `${unique1stClass}`
          )}
          {renderPlayer(
            '2nd place',
            finalStandings.second,
            '🥈',
            `${unique2ndClass}`
          )}
          {renderPlayer(
            '3rd place',
            finalStandings.third,
            '🥉',
            `${unique3dClass}`
          )}
          {renderPlayer(
            '4th place',
            finalStandings.fourth,
            '🎖️',
            `${unique4thClass}`
          )}
        </ul>
        <button
          ref={firstFocusableRef}
          onClick={onPlayAgain}
          className={`${textClass} bg-yellow-400 w-full text-gray-900 font-semibold px-4 py-2 rounded hover:bg-yellow-300 transition`}
          aria-label="Play tournament again"
        >
          Play again
        </button>
      </div>
    </div>
  )
}
