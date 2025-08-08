import { useEffect, useRef } from 'react'
import { getPlayerImage } from './PlayersDisplay'
import { useFocusTrap } from '../hooks/useFocuseTrap'

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
  const firstFocusableRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (winner && firstFocusableRef.current) {
      firstFocusableRef.current.focus()
    }
  }, [winner])

  const modalRef = useRef<HTMLDivElement>(null)
  useFocusTrap(modalRef as React.RefObject<HTMLElement>, Boolean(winner))

  if (!winner) return null

  const winnerImage = getPlayerImage(winner)
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
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
          🏁 Round winner: {winner}
        </h2>
        <p id="modal-description" className="sr-only">
          The winner of the round is {winner}. You can proceed to the next round
          by pressing the button below.
        </p>
        <div className="flex justify-center">
          <img
            src={winnerImage}
            alt={`Winner is ${winner}`}
            className="w-24 h-24 object-cover"
          />
        </div>
        <button
          ref={firstFocusableRef}
          aria-label={`Proceed to next round: ${roundLabel}`}
          onClick={onNextRound}
          className="w-full bg-yellow-400 text-gray-900 font-semibold px-4 py-2 rounded hover:bg-yellow-300 transition"
        >
          Next round: {roundLabel}
        </button>
      </div>
    </div>
  )
}
