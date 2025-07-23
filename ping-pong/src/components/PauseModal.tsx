import React from 'react'
import { ContinueIcon } from './Btns/ContinueBtn'

type PauseModalProps = {
  onContinue: () => void
}

const PauseModal: React.FC<PauseModalProps> = ({ onContinue }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-40">
      <div>
        <button
          onClick={onContinue}
          className="group px-6 py-2"
          aria-label="Continue game"
        >
          <ContinueIcon className="w-12 h-12 text-indigo-600 group-hover:text-indigo-800 transition-colors duration-200" />
        </button>
      </div>
    </div>
  )
}

export default PauseModal
