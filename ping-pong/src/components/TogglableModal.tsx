import React, { useEffect, useRef } from 'react'
import player1 from '../assets/images/playerLeft.png'
import player2 from '../assets/images/playerRight.png'
import player3 from '../assets/images/player3.png'
import player4 from '../assets/images/player4.png'
import playerAI from '../assets/images/playerAI.png'
import type {
  AIDifficultyOption,
  DifficultyOption,
  IsTournament,
} from '../types/types'
import { useFocusTrap } from '../hooks/useFocuseTrap'

type PaddleSizeOption = 'small' | 'medium' | 'large'
type OpponentType = 'player' | 'ai'
interface PlayerAliases {
  player1: string
  player2: string
  player3: string
  player4: string
}

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
  isTournament: IsTournament
  setIsTournament: (value: IsTournament) => void
  playerAliases: PlayerAliases
  setPlayerAliases: (value: PlayerAliases) => void
  errors: Partial<PlayerAliases>
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
  isTournament,
  setIsTournament,
  playerAliases,
  setPlayerAliases,
  errors,
}) => {
  const firstFocusableRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (show && firstFocusableRef.current) {
      firstFocusableRef.current.focus()
    }
  }, [show])

  const modalRef = useRef<HTMLDivElement>(null)
  useFocusTrap(modalRef as React.RefObject<HTMLElement>, show)

  useEffect(() => {
    if (!show) return

    const fetchAliases = async () => {
      try {
        // fetch current user
        const currentUserRes = await fetch('/DBs/currentUser.json')
        const currentUserData = await currentUserRes.json()

        let aliasesObj: PlayerAliases = {
          player1: currentUserData.username || 'Player 1',
          player2: '',
          player3: '',
          player4: '',
        }

        if (isTournament === 'tournament') {
          // берём троих оппонентов
          const playersRes = await fetch('/DBs/players.json')
          const playersData = await playersRes.json()

          aliasesObj = {
            ...aliasesObj,
            player2: playersData[0]?.username || 'Player 2',
            player3: playersData[1]?.username || 'Player 3',
            player4: playersData[2]?.username || 'Player 4',
          }
        } else if (isTournament === 'CasualGame') {
          if (opponentType === 'player') {
            const playersRes = await fetch('/DBs/players.json')
            const playersData = await playersRes.json()

            aliasesObj = {
              ...aliasesObj,
              player2: playersData[0]?.username || 'Player 2',
            }
          } else if (opponentType === 'ai') {
            aliasesObj = {
              ...aliasesObj,
              player2: 'AI Opponent',
            }
          }
        }

        setPlayerAliases(aliasesObj)
      } catch (err) {
        console.error(err)
      }
    }

    fetchAliases()
  }, [show, isTournament, opponentType, setPlayerAliases])

  if (!show) return null

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50"
    >
      <h2 id="modal-title" className="sr-only">
        Game Settings
      </h2>
      <p id="modal-desc" className="sr-only">
        Set your game preferences, such as paddle size, difficulty, and opponent
        type.
      </p>
      <div className="bg-black border border-white p-8 rounded-2xl text-center min-w-[300px]">
        {/* Tournament */}
        <div className="mb-6">
          <div
            role="radiogroup"
            aria-labelledby="tournament-label"
            className="mb-6 flex items-center justify-between gap-4"
          >
            <span
              id="tournament-label"
              className={`font-medium text-white min-w-[140px] text-left`}
            >
              Play tournament?
            </span>

            <button
              ref={firstFocusableRef}
              role="radio"
              aria-checked={isTournament === 'CasualGame'}
              onClick={() => setIsTournament('CasualGame')}
              className={`px-6 py-2 rounded-lg border-2 font-semibold border-white text-white transition-opacity duration-300
    ${
      isTournament === 'CasualGame'
        ? 'opacity-100'
        : 'opacity-40 hover:opacity-60'
    }
  `}
            >
              no
            </button>
            <button
              role="radio"
              aria-checked={isTournament === 'tournament'}
              onClick={() => setIsTournament('tournament')}
              className={`px-6 py-2 rounded-lg border-2 font-semibold border-white text-white transition-opacity duration-300
    ${
      isTournament === 'tournament'
        ? 'opacity-100'
        : 'opacity-40 hover:opacity-60'
    }
  `}
            >
              yes
            </button>
          </div>
        </div>

        {/* Display aliases */}
        {isTournament === 'tournament' && (
          <div className="mb-6 grid grid-cols-2 gap-4 justify-items-center">
            {[1, 2, 3, 4].map((n) => {
              const imgSrc = [player1, player2, player3, player4][n - 1]
              const alias = playerAliases[`player${n}` as keyof PlayerAliases]
              return (
                <div key={n} className="flex flex-col items-center gap-2">
                  <img
                    src={imgSrc}
                    alt={`Player ${n}`}
                    className="w-10 h-10 object-cover"
                  />
                  <span className="text-white font-medium">{alias}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* Opponent */}
        {isTournament === 'CasualGame' && (
          <div className="mb-6">
            <div
              role="radiogroup"
              aria-labelledby="opponent-label"
              className="flex justify-center space-x-4"
            >
              <button
                data-testid="playersMode"
                role="radio"
                aria-checked={opponentType === 'player'}
                onClick={() => onOpponentTypeChange('player')}
                disabled={isRunning}
                className={`px-4 w-full  py-2 rounded-md border border-white text-white flex justify-center items-center ${
                  opponentType === 'player' ? '' : 'opacity-40 hover:opacity-60'
                } disabled:opacity-50`}
              >
                <div className="flex items-center gap-4">
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
                role="radio"
                aria-checked={opponentType === 'ai'}
                onClick={() => onOpponentTypeChange('ai')}
                disabled={isRunning}
                className={`px-4 w-full py-2 rounded-md border border-white text-white flex justify-center items-center ${
                  opponentType === 'ai' ? '' : 'opacity-40 hover:opacity-60'
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
            <div className="mt-2 text-white text-center text-sm">
              {opponentType === 'player'
                ? `Opponent: ${playerAliases.player2}`
                : 'Opponent: AI'}
            </div>
          </div>
        )}

        {/* AI Difficulty */}
        {opponentType === 'ai' && isTournament === 'CasualGame' && (
          <div className="mb-6 flex items-center justify-between gap-4">
            <label
              htmlFor="ai-difficulty-select"
              className="font-medium text-white min-w-[140px] text-left"
            >
              AI Intelligence:
            </label>
            <select
              id="ai-difficulty-select"
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
          <label
            htmlFor="paddle-size"
            className="font-medium text-white min-w-[140px] text-left"
          >
            Paddle size:
          </label>
          <select
            id="paddle-size"
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
          <label
            htmlFor="obstacle-select"
            className="font-medium text-white min-w-[140px] text-left"
          >
            Obstacle:
          </label>
          <select
            id="obstacle-select"
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
          className="mt-4 w-full px-6 py-2 bg-yellow-400 text-black font-semibold  rounded-md hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
}

export default GameSettingsModal
