import React from 'react'

type ControlsPanelProps = {
  isRunning: boolean
  onToggleRunning: () => void
  onRestart: () => void
  disabled?: boolean
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({
  isRunning,
  onToggleRunning,
  onRestart,
  disabled,
}) => (
  <div className="flex gap-4">
    <button
      onClick={onToggleRunning}
      disabled={disabled}
      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isRunning ? 'Pause' : 'Continue'}
    </button>
    <button
      onClick={onRestart}
      disabled={disabled}
      className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition"
    >
      Restart
    </button>
  </div>
)

export default ControlsPanel
