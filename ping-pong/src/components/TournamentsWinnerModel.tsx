import { PlayerID } from '../types/types'
import { getPlayerImage } from './PlayersDisplay'

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
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <div className="bg-gray-900 border-4 border-white-400 rounded-lg p-8 w-100 text-center text-white space-y-6">
        <h2 className="w-full text-center text-3xl font-bold mb-4">
          🏆 Tournament results
        </h2>

        <ul className="">
          {renderPlayer('1st place', finalStandings.first, '🥇', 'text-2xl')}
          {renderPlayer('2nd place', finalStandings.second, '🥈', 'text-xl')}
          {renderPlayer('3rd place', finalStandings.third, '🥉', 'text-lg')}
          {renderPlayer('4th place', finalStandings.fourth, '🎖️', 'text-base')}
        </ul>
        <button
          onClick={onPlayAgain}
          className="bg-yellow-400 w-full text-gray-900 font-semibold px-4 py-2 rounded hover:bg-yellow-300 transition"
        >
          Play again
        </button>
      </div>
    </div>
  )
}
