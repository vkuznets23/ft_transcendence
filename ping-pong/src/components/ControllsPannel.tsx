import React, { useState, useEffect } from 'react'
import { PauseIcon } from './Btns/PauseBtn'
import { ContinueIcon } from './Btns/ContinueBtn'
import { RestartIcon } from './Btns/RestartBtn'
import { SoundsOffIcons, SoundsOnIcons } from './Btns/SoundsBtns'
import { Settings } from './Btns/Settings'

type ControlsPanelProps = {
  isSoundOn: boolean
  isRunning: boolean
  onToggleRunning: () => void
  onRestart: () => void
  onToggleSound: () => void
  disabled?: boolean
  showLabels?: boolean
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({
  isSoundOn,
  isRunning,
  onToggleRunning,
  onRestart,
  onToggleSound,
  disabled,
  showLabels = true,
}) => {
  const [open, setOpen] = useState(false)
  const [isTooSmall, setIsTooSmall] = useState(() => window.innerWidth < 450)

  useEffect(() => {
    const update = () => setIsTooSmall(window.innerWidth < 450)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const handleClose = () => setOpen(false)

  return (
    <div>
      {/* Desktop buttons */}
      {!isTooSmall && (
        <div className="flex gap-4">
          <ControlButtons
            isSoundOn={isSoundOn}
            isRunning={isRunning}
            onToggleRunning={onToggleRunning}
            onRestart={onRestart}
            onToggleSound={onToggleSound}
            disabled={disabled}
            showLabels={showLabels}
          />
        </div>
      )}
      {/* Mobile settings button */}
      {isTooSmall && (
        <div className="flex relative">
          <button
            aria-label="Toggle settings menu"
            onClick={() => {
              if (!open && isRunning) onToggleRunning()
              setOpen((prev) => !prev)
            }}
            className="w-10 h-10 bg-indigo-600 hover:bg-indigo-800 rounded-md flex items-center justify-center"
          >
            <Settings className="text-white w-6 h-6" />
          </button>

          {/* Mobile modal (tiny screens < 400px) */}
          {open && (
            <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex justify-center items-center">
              <div className="bg-white p-4 rounded-md shadow-xl flex flex-col gap-3 w-[200px]">
                <button
                  onClick={() => {
                    onToggleRunning()
                    handleClose()
                  }}
                  className="min-w-[40px] min-h-[40px] bg-indigo-600 hover:bg-indigo-800 text-white rounded-md flex justify-center items-center"
                  disabled={disabled}
                >
                  {isRunning ? (
                    <PauseIcon className="w-5 h-5" />
                  ) : (
                    <ContinueIcon className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => {
                    onRestart()
                    handleClose()
                  }}
                  className="min-w-[40px] min-h-[40px] bg-red-600 hover:bg-red-800 text-white rounded-md flex justify-center items-center"
                  disabled={disabled}
                >
                  <RestartIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    onToggleSound()
                    onToggleRunning()
                    handleClose()
                  }}
                  className="min-w-[40px] min-h-[40px] bg-green-600 hover:bg-green-800 text-white rounded-md flex justify-center items-center"
                >
                  {isSoundOn ? (
                    <SoundsOnIcons className="w-5 h-5" />
                  ) : (
                    <SoundsOffIcons className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ControlsPanel

const ControlButtons = ({
  isSoundOn,
  isRunning,
  onToggleRunning,
  onRestart,
  onToggleSound,
  disabled,
  showLabels,
}: ControlsPanelProps) => (
  <>
    <button
      onClick={onToggleRunning}
      disabled={disabled}
      className="px-4 py-2 disabled:cursor-not-allowed flex items-center gap-2 rounded-md group bg-indigo-600 hover:bg-indigo-800 transition-colors duration-200"
    >
      {isRunning ? (
        <>
          {showLabels && (
            <span className="text-indigo-100 group-hover:text-purple-200 font-medium">
              Pause
            </span>
          )}
          <PauseIcon className="w-5 h-5 text-indigo-100" />
        </>
      ) : (
        <>
          {showLabels && (
            <span className="text-indigo-100 group-hover:text-purple-200 font-medium">
              Continue
            </span>
          )}
          <ContinueIcon className="w-5 h-5 text-indigo-100" />
        </>
      )}
    </button>

    <button
      onClick={onRestart}
      disabled={disabled}
      className="px-4 py-2 flex items-center gap-2 rounded-md group bg-red-600 hover:bg-red-800 transition-colors duration-200"
    >
      {showLabels && (
        <span className="text-indigo-100 group-hover:text-purple-200 font-medium">
          Restart
        </span>
      )}
      <RestartIcon className="w-5 h-5 text-indigo-100" />
    </button>

    <button
      onClick={onToggleSound}
      className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-800 rounded text-white"
    >
      {isSoundOn ? (
        <div className="flex items-center gap-2">
          {showLabels && <span>Sounds on</span>}
          <SoundsOnIcons />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {showLabels && <span>Sounds off</span>}
          <SoundsOffIcons />
        </div>
      )}
    </button>
  </>
)
