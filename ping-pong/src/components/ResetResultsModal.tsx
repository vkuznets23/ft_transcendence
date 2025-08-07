import { getPlayerImage } from './PlayersDisplay'

type RoundResultModalProps = {
  winner: 'player1' | 'player2' | 'player3' | 'player4' | null
  onNextRound: () => void
  roundLabel: string
}
export const RoundResultModal = ({
  winner,
  onNextRound,
  roundLabel,
}: RoundResultModalProps) => {
  if (!winner) return null

  const winnerImage = getPlayerImage(winner)
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <div className="bg-gray-900 border-4 border-white rounded-lg p-8 w-96 text-center text-white space-y-6">
        <h2 className="w-full text-center text-2xl font-bold mb-4">
          🏁 Round winner: {winner}
        </h2>
        <div className="flex justify-center">
          <img
            src={winnerImage}
            alt="winner"
            className="w-24 h-24 object-cover"
          />
        </div>
        <button
          onClick={onNextRound}
          className="w-full bg-yellow-400 text-gray-900 font-semibold px-4 py-2 rounded hover:bg-yellow-300 transition"
        >
          Next round: {roundLabel}
        </button>
      </div>
    </div>
  )
}
