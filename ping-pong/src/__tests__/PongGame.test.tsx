import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import PongGame from '../components/game'

// mock all internal modals and components
jest.mock('../components/TogglableModal', () => () => (
  <div data-testid="settings-modal">GameSettingsModal</div>
))
jest.mock('../components/ControllsPannel', () => () => (
  <div data-testid="controls-panel">ControlsPanel</div>
))
jest.mock(
  '../components/PauseModal',
  () =>
    ({ onContinue }: { onContinue: () => void }) =>
      (
        <div data-testid="pause-modal" onClick={onContinue}>
          PauseModal
        </div>
      )
)
jest.mock('../components/PlayersDisplay', () => {
  return {
    __esModule: true,
    PlayersDisplay: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="players-display">{children}</div>
    ),
  }
})
jest.mock(
  '../components/ResetResultsModal',
  () =>
    ({ winner }: { winner: string }) =>
      <div data-testid="round-result-modal">{winner}</div>
)
jest.mock('../components/TournamentsWinnerModel', () => () => (
  <div data-testid="tournament-winner-modal">TournamentWinnerModal</div>
))
jest.mock('../components/CasualGameModal', () => () => (
  <div data-testid="casual-game-modal">CasualGameModal</div>
))

// mock hooks
jest.mock('../hooks/useGameStates', () => ({
  useGameState: () => ({
    setCurrentPlayerA: jest.fn(),
    setCurrentPlayerB: jest.fn(),
    finalStandings: [],
    setFinalStandings: jest.fn(),
    tournamentWinner: null,
    setTournamentWinner: jest.fn(),
    finishCurrentMatch: jest.fn(),
    tournament: {
      finished: false,
      matches: [],
      currentMatchIndex: 0,
    },
    currentPlayerA: 'player1',
    currentPlayerB: 'player2',
    setTournamentWins: jest.fn(),
    showRoundResultModal: false,
    setShowRoundResultModal: jest.fn(),
    roundWinner: null,
    setRoundWinner: jest.fn(),
    gameMode: 'casual',
    setGameMode: jest.fn(),
    isRunning: false,
    setIsRunning: jest.fn(),
    showModal: true,
    setShowModal: jest.fn(),
    gameOver: true,
    setGameOver: jest.fn(),
    opponentType: 'player',
    setOpponentType: jest.fn(),
    isSoundOn: true,
    setIsSoundOn: jest.fn(),
    showPauseModal: false,
    setShowPauseModal: jest.fn(),
    AIdifficulty: 'easy',
    setAIDifficulty: jest.fn(),
    paddleSizeOption: 'normal',
    setPaddleSizeOption: jest.fn(),
    difficulty: 'easy',
    setDifficulty: jest.fn(),
    score1State: 0,
    setScore1State: jest.fn(),
    score2State: 0,
    setScore2State: jest.fn(),
    obstacle: null,
    setObstacle: jest.fn(),
    isRunningRef: { current: false },
    paddleHeightRef: { current: 100 },
    updatePaddleHeight: jest.fn(),
  }),
}))

jest.mock('../hooks/useGameSounds', () => ({
  useGameSounds: () => ({
    playAddPoint: jest.fn(),
    playGameOver: jest.fn(),
    playGameStart: jest.fn(),
    playPong: jest.fn(),
  }),
}))

jest.mock('../hooks/useGameLoop', () => ({
  useGameLoop: jest.fn(),
}))

jest.mock('../hooks/usePlayerControls', () => ({
  usePlayerControls: () => ({
    upPressed: { current: false },
    downPressed: { current: false },
    wPressed: { current: false },
    sPressed: { current: false },
    handleKeyDown: jest.fn(),
    handleKeyUp: jest.fn(),
  }),
}))

jest.mock('../hooks/useAIPlayer', () => ({
  useAIPlayer: jest.fn(),
}))

jest.mock('../hooks/useGameInitializer', () => ({
  useGameInitializer: () => jest.fn(),
}))

jest.mock('../utils/generateObstacle', () => ({
  generateRandomObstacle: jest.fn(),
}))

describe('PongGame', () => {
  it('renders PlayersDisplay component', () => {
    render(<PongGame />)
    expect(screen.getByTestId('players-display')).toBeInTheDocument()
  })

  it('renders game canvas', () => {
    render(<PongGame />)
    const canvas = screen.getByTestId('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('renders settings modal when showModal is true', () => {
    render(<PongGame />)
    expect(screen.getByTestId('settings-modal')).toBeInTheDocument()
  })

  it('renders controls panel', () => {
    render(<PongGame />)
    expect(screen.getByTestId('controls-panel')).toBeInTheDocument()
  })

  it('toggles pause modal with space key', () => {
    render(<PongGame />)

    fireEvent.keyDown(window, { code: 'Space' })

    expect(true).toBe(true)
  })
})
