import { useEffect, useRef } from 'react'
import { getPlayerImage } from './PlayersDisplay'
import { useFocusTrap } from '../hooks/useFocuseTrap'

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
  const firstFocusableRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (winner && firstFocusableRef.current) {
      firstFocusableRef.current.focus()
    }
  }, [winner])

  const modalRef = useRef<HTMLDivElement>(null)
  useFocusTrap(modalRef as React.RefObject<HTMLElement>, Boolean(winner))

  if (!winner) return null

  const normalizedWinner =
    opponentType === 'ai' && winner === 'player2' ? 'playerAI' : winner

  const winnerImage = getPlayerImage(normalizedWinner)
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <div
        ref={modalRef}
        className="bg-gray-900 border-4 border-white rounded-lg p-8 w-96 text-center text-white space-y-6"
      >
        <h2
          id="modal-title"
          className="w-full text-center text-2xl font-bold mb-4"
        >
          🏁 Round winner: {normalizedWinner}
        </h2>

        <div className="flex justify-center">
          <img
            src={winnerImage}
            alt={`Winner is ${normalizedWinner}`}
            className="w-24 h-24 object-cover"
          />
        </div>
        <button
          type="button"
          ref={firstFocusableRef}
          onClick={onPlayAgain}
          className="w-full bg-yellow-400 text-gray-900 font-semibold px-4 py-2 rounded hover:bg-yellow-300 transition"
        >
          Play Again
        </button>
      </div>
    </div>
  )
}
