import React, { useEffect, useRef } from 'react'
import Lightning from './lightning'
import playerLeftImg from '../assets/images/playerLeft.png'
import playerRightImg from '../assets/images/playerRight.png'
import player3Img from '../assets/images/player3.png'
import player4Img from '../assets/images/player4.png'
import { useFocusTrap } from '../hooks/useFocuseTrap'

interface MatchModalProps {
  show: boolean
  onClose: () => void
  playerLeft?: 'player1' | 'player2' | 'player3' | 'player4'
  playerRight?: 'player1' | 'player2' | 'player3' | 'player4'
  playerAliases: Record<string, string>
}

const playerImages = {
  player1: playerLeftImg,
  player2: playerRightImg,
  player3: player3Img,
  player4: player4Img,
}

export const MatchModal: React.FC<MatchModalProps> = ({
  show,
  onClose,
  playerLeft,
  playerRight,
  playerAliases,
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLButtonElement>(null)

  useFocusTrap(modalRef as React.RefObject<HTMLElement>, show)

  useEffect(() => {
    if (show && firstFocusableRef.current) {
      firstFocusableRef.current.focus()
    }
  }, [show])
  if (!show) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-[#1f1f1f] rounded-xl p-8 flex flex-col items-center gap-6 relative border-4 border-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-12">
          <div className="w-32 h-40 flex flex-col justify-center items-center">
            {playerLeft && (
              <>
                <img
                  src={playerImages[playerLeft]}
                  alt={playerLeft}
                  className="max-w-full max-h-full object-contain"
                />
                <p className="text-white text-center mt-2">
                  {playerAliases[playerLeft]}
                </p>
              </>
            )}
          </div>

          <Lightning />

          <div className="w-32 h-40 flex flex-col justify-center items-center">
            {playerRight && (
              <>
                <img
                  src={playerImages[playerRight]}
                  alt={playerRight}
                  className="max-w-full max-h-full object-contain"
                />
                <p className="text-white text-center mt-2">
                  {playerAliases[playerRight]}
                </p>
              </>
            )}
          </div>
        </div>

        <button
          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          onClick={onClose}
        >
          Start the round
        </button>
      </div>
    </div>
  )
}
