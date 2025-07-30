import React from 'react'
import player1 from '../assets/images/playerLeft.png'
import player2 from '../assets/images/playerRight.png'
import playerAI from '../assets/images/playerAI.png'
import type { AIDifficultyOption, DifficultyOption } from '../types/types'

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
  onAIDifficultyChange: (value: AIDifficultyOption) => void
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
      <div className="bg-black border border-white p-8 rounded-2xl text-center min-w-[300px]">
        {/* Opponent */}
        <div className="mb-6">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => onOpponentTypeChange('player')}
              disabled={isRunning}
              className={`px-4 py-2 rounded-md border border-white text-white ${
                opponentType === 'player' ? '' : 'opacity-40'
              } disabled:opacity-50`}
            >
              <div className="flex items-center gap-2">
                <img
                  src={player1}
                  alt="player1"
                  className="flex justify-start h-[40px]"
                />
                <img
                  src={player2}
                  alt="player1"
                  className="flex justify-start h-[40px]"
                />
              </div>
            </button>
            <button
              onClick={() => onOpponentTypeChange('ai')}
              disabled={isRunning}
              className={`px-4 py-2 rounded-md border border-white text-white ${
                opponentType === 'ai' ? '' : 'opacity-40'
              } disabled:opacity-50`}
            >
              <div className="flex items-center gap-2">
                <img
                  src={player1}
                  alt="player1"
                  className="flex justify-start h-[40px]"
                />
                <img
                  src={playerAI}
                  alt="player1"
                  className="flex justify-start h-[40px]"
                />
              </div>
            </button>
          </div>
        </div>

        {/* AI Difficulty */}
        {opponentType === 'ai' && (
          <div className="mb-6 flex items-center justify-between gap-4">
            <label className="font-medium text-white min-w-[140px] text-left">
              AI Intelligence:
            </label>
            <select
              value={AIdifficulty}
              onChange={(e) =>
                onAIDifficultyChange(e.target.value as AIDifficultyOption)
              }
              disabled={isRunning}
              className="w-full px-3 py-2 bg-black text-white border border-white rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
            >
              <option value="easy">404 IQ Not Found</option>
              <option value="hard">Gigabrain</option>
            </select>
          </div>
        )}

        {/* Paddle Size */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <label className="font-medium text-white min-w-[140px] text-left">
            Paddle size:
          </label>
          <select
            value={paddleSizeOption}
            onChange={(e) =>
              onPaddleSizeChange(e.target.value as PaddleSizeOption)
            }
            disabled={isRunning}
            className="w-full px-3 py-2 bg-black text-white border border-white rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        {/* Obstacle */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <label className="font-medium text-white min-w-[140px] text-left">
            Obstacle:
          </label>
          <select
            value={difficulty}
            onChange={(e) =>
              onDifficultyChange(e.target.value as DifficultyOption)
            }
            disabled={isRunning}
            className="w-full px-3 py-2 bg-black text-white border border-white rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
          >
            <option value="easy">Clear Sky</option>
            <option value="medium">Static Trouble</option>
            <option value="hard">Chaos Mode</option>
          </select>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          disabled={isRunning}
          className="mt-4 px-6 py-2 bg-white text-black font-semibold border border-white rounded-md hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
}

export default GameSettingsModal
