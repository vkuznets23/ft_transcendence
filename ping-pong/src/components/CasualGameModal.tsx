import { getPlayerImage } from './PlayersDisplay'

type CasualGameMofalTypes = {
  winner: 'player1' | 'player2' | 'playerAI' | null
  onPlayAgain: () => void
  opponentType: 'ai' | 'player'
}
export const CasualGameModal = ({
  winner,
  onPlayAgain,
  opponentType,
}: CasualGameMofalTypes) => {
  if (!winner) return null

  const normalizedWinner =
    opponentType === 'ai' && winner === 'player2' ? 'playerAI' : winner

  const winnerImage = getPlayerImage(normalizedWinner)
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <div className="bg-gray-900 border-4 border-white rounded-lg p-8 w-96 text-center text-white space-y-6">
        <h2 className="w-full text-center text-2xl font-bold mb-4">
          🏁 Round winner: {normalizedWinner}
        </h2>
        <div className="flex justify-center">
          <img
            src={winnerImage}
            alt="winner"
            className="w-24 h-24 object-cover"
          />
        </div>
        <button
          onClick={onPlayAgain}
          className="w-full bg-yellow-400 text-gray-900 font-semibold px-4 py-2 rounded hover:bg-yellow-300 transition"
        >
          Play Again
        </button>
      </div>
    </div>
  )
}
