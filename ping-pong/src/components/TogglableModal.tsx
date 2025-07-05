import React from 'react'
import { type AIDifficultyOption, type DifficultyOption } from './game'

type PaddleSizeOption = 'small' | 'medium' | 'large'
type OpponentType = 'player' | 'ai'

interface GameSettingsModalProps {
  buttonText: string
  show: boolean
  isRunning: boolean
  paddleSizeOption: PaddleSizeOption
  difficulty: DifficultyOption
  AIdifficulty: AIDifficultyOption
  onPaddleSizeChange: (value: PaddleSizeOption) => void
  onDifficultyChange: (value: DifficultyOption) => void
  onAIDifficultyChange: (value: DifficultyOption) => void
  onStart: () => void
  opponentType: OpponentType
  onOpponentTypeChange: (value: OpponentType) => void
}

const GameSettingsModal: React.FC<GameSettingsModalProps> = ({
  buttonText,
  show,
  isRunning,
  paddleSizeOption,
  difficulty,
  AIdifficulty,
  onPaddleSizeChange,
  onDifficultyChange,
  onAIDifficultyChange,
  onStart,
  opponentType,
  onOpponentTypeChange,
}) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg text-center min-w-[300px]">
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">
            Opponent:
          </label>
          <select
            value={opponentType}
            onChange={(e) =>
              onOpponentTypeChange(e.target.value as OpponentType)
            }
            disabled={isRunning}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <option value="player">Player</option>
            <option value="ai">AI</option>
          </select>
        </div>

        {opponentType === 'ai' && (
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">
              AI difficulty level:
            </label>
            <select
              value={AIdifficulty}
              onChange={(e) =>
                onAIDifficultyChange(e.target.value as AIDifficultyOption)
              }
              disabled={isRunning}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <option value="easy">Stupid</option>
              <option value="hard">Giga smart</option>
            </select>
          </div>
        )}

        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">
            Paddle size:
          </label>
          <select
            value={paddleSizeOption}
            onChange={(e) =>
              onPaddleSizeChange(e.target.value as PaddleSizeOption)
            }
            disabled={isRunning}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">
            Difficulty level:
          </label>
          <select
            value={difficulty}
            onChange={(e) =>
              onDifficultyChange(e.target.value as DifficultyOption)
            }
            disabled={isRunning}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <option value="easy">Easy</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <button
          onClick={onStart}
          disabled={isRunning}
          className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
}

export default GameSettingsModal
