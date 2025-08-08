import React, { useEffect, useRef } from 'react'
import { ContinueIcon } from './Btns/ContinueBtn'
import { useFocusTrap } from '../hooks/useFocuseTrap'

type PauseModalProps = {
  onContinue: () => void
}

const PauseModal: React.FC<PauseModalProps> = ({ onContinue }) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useFocusTrap(modalRef as React.RefObject<HTMLElement>, true)

  useEffect(() => {
    buttonRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Space') {
        onContinue()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onContinue])

  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-title"
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-40 animate-float"
    >
      <div className="bg-black border border-white p-8 rounded-2xl text-center min-w-[300px]">
        <h2
          id="pause-title"
          className="text-white text-2xl font-bold mb-2 flex justify-center items-center gap-2"
        >
          Game paused
        </h2>
        <p className="text-white mb-6">Press continue to resume.</p>
        <button
          ref={buttonRef}
          onClick={onContinue}
          className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md"
          aria-label="Continue game"
        >
          <div className="px-6 py-2 bg-indigo-600 text-indigo-100 rounded-md flex items-center gap-2 group-hover:bg-indigo-800 transition-colors duration-200">
            <span className="text-indigo-100 group-hover:text-purple-200 font-medium">
              Continue
            </span>
            <ContinueIcon className="w-5 h-5 text-indigo-100" />
          </div>
        </button>
      </div>
    </div>
  )
}

export default PauseModal
