import React from 'react'

type PaddleSizeOption = 'small' | 'medium' | 'large'
type DifficultyOption = 'easy' | 'hard'

interface GameSettingsModalProps {
  buttonText: string
  show: boolean
  isRunning: boolean
  paddleSizeOption: PaddleSizeOption
  difficulty: DifficultyOption
  onPaddleSizeChange: (value: PaddleSizeOption) => void
  onDifficultyChange: (value: DifficultyOption) => void
  onStart: () => void
}

const GameSettingsModal: React.FC<GameSettingsModalProps> = ({
  buttonText,
  show,
  isRunning,
  paddleSizeOption,
  difficulty,
  onPaddleSizeChange,
  onDifficultyChange,
  onStart,
}) => {
  if (!show) return null

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div>
          <label>Paddle size:</label>
          <select
            value={paddleSizeOption}
            onChange={(e) =>
              onPaddleSizeChange(e.target.value as PaddleSizeOption)
            }
            disabled={isRunning}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div>
          <label>Difficulty level:</label>
          <select
            value={difficulty}
            onChange={(e) =>
              onDifficultyChange(e.target.value as DifficultyOption)
            }
            disabled={isRunning}
          >
            <option value="easy">Easy</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <button onClick={onStart} style={startButtonStyle}>
          {buttonText}
        </button>
      </div>
    </div>
  )
}

export default GameSettingsModal

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
}

const modalContentStyle: React.CSSProperties = {
  background: '#fff',
  padding: '2rem',
  borderRadius: '10px',
  textAlign: 'center',
  minWidth: '300px',
}

const startButtonStyle: React.CSSProperties = {
  marginTop: '1rem',
  padding: '0.5rem 1.5rem',
  fontSize: '1rem',
  backgroundColor: '#1a1a1a',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
}
