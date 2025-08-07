/* eslint-disable testing-library/no-node-access */
import React, { act } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ControlsPanel from '../components/ControllsPannel'

// icons mocks
jest.mock('../components/Btns/PauseBtn', () => ({
  PauseIcon: () => <svg data-testid="pause-icon" />,
}))
jest.mock('../components/Btns/ContinueBtn', () => ({
  ContinueIcon: () => <svg data-testid="continue-icon" />,
}))
jest.mock('../components/Btns/RestartBtn', () => ({
  RestartIcon: () => <svg data-testid="restart-icon" />,
}))
jest.mock('../components/Btns/SoundsBtns', () => ({
  SoundsOnIcons: () => <svg data-testid="sounds-on-icon" />,
  SoundsOffIcons: () => <svg data-testid="sounds-off-icon" />,
}))
jest.mock('../components/Btns/Settings', () => ({
  Settings: () => <svg data-testid="settings-icon" />,
}))

describe('ControlsPanel', () => {
  const mockToggleRunning = jest.fn()
  const mockRestart = jest.fn()
  const mockToggleSound = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const setup = (props = {}) => {
    return render(
      <ControlsPanel
        isSoundOn={true}
        isRunning={true}
        onToggleRunning={mockToggleRunning}
        onRestart={mockRestart}
        onToggleSound={mockToggleSound}
        {...props}
      />
    )
  }

  it('renders desktop buttons with labels by default', () => {
    setup()

    expect(screen.getByText(/pause/i)).toBeInTheDocument()
    expect(screen.getByText(/restart/i)).toBeInTheDocument()
    expect(screen.getByText(/sounds on/i)).toBeInTheDocument()

    expect(screen.getByTestId('pause-icon')).toBeInTheDocument()
    expect(screen.getByTestId('restart-icon')).toBeInTheDocument()
    expect(screen.getByTestId('sounds-on-icon')).toBeInTheDocument()
  })

  it('calls onToggleRunning when pause button is clicked', () => {
    setup()
    fireEvent.click(screen.getByText(/pause/i))
    expect(mockToggleRunning).toHaveBeenCalledTimes(1)
  })

  it('calls onRestart when restart button is clicked', () => {
    setup()
    fireEvent.click(screen.getByText(/restart/i))
    expect(mockRestart).toHaveBeenCalledTimes(1)
  })

  it('calls onToggleSound when sounds button is clicked', () => {
    setup()
    fireEvent.click(screen.getByText(/sounds on/i))
    expect(mockToggleSound).toHaveBeenCalledTimes(1)
  })

  it('does not show labels if showLabels is false', () => {
    setup({ showLabels: false })

    expect(screen.queryByText(/pause/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/restart/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/sounds on/i)).not.toBeInTheDocument()
  })

  describe('ControlsPanel mobile behavior', () => {
    const resizeWindow = (width: number) => {
      ;(window as any).innerWidth = width
      window.dispatchEvent(new Event('resize'))
    }

    it('shows Settings button and hides desktop buttons when width < 450', () => {
      act(() => {
        resizeWindow(400)
      })
      render(
        <ControlsPanel
          isSoundOn={true}
          isRunning={true}
          onToggleRunning={mockToggleRunning}
          onRestart={mockRestart}
          onToggleSound={mockToggleSound}
        />
      )
      expect(screen.queryByText(/pause/i)).not.toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /toggle settings menu/i })
      ).toBeInTheDocument()
    })

    it('toggles mobile settings menu and calls callbacks', () => {
      act(() => resizeWindow(400))
      setup()

      const settingsButton = screen.getByRole('button', {
        name: /toggle settings menu/i,
      })

      fireEvent.click(settingsButton)
      mockToggleRunning.mockClear()

      fireEvent.click(screen.getByTestId('pause-icon'))
      expect(mockToggleRunning).toHaveBeenCalledTimes(1)
    })
    it('calls onRestart and closes menu on restart button click in mobile menu', () => {
      act(() => resizeWindow(400))
      setup()

      const settingsButton = screen.getByRole('button', {
        name: /toggle settings menu/i,
      })
      fireEvent.click(settingsButton)

      fireEvent.click(screen.getByTestId('restart-icon'))
      expect(mockRestart).toHaveBeenCalledTimes(1)

      expect(screen.queryByTestId('restart-icon')).not.toBeInTheDocument()
    })

    it('calls onToggleSound and closes menu on sound button click in mobile menu', () => {
      act(() => resizeWindow(400))
      setup()

      const settingsButton = screen.getByRole('button', {
        name: /toggle settings menu/i,
      })
      fireEvent.click(settingsButton)

      const soundIcon = screen.getByTestId('sounds-on-icon')
      const soundButton = soundIcon.closest('button')
      if (!soundButton) throw new Error('Sound button not found')

      fireEvent.click(soundButton)
      expect(mockToggleSound).toHaveBeenCalledTimes(1)

      expect(screen.queryByTestId('sounds-on-icon')).not.toBeInTheDocument()
    })

    it('opens modal menu for width < 400 and calls callbacks on buttons', () => {
      act(() => resizeWindow(399))
      setup()

      const settingsButton = screen.getByRole('button', {
        name: /Toggle settings menu/i,
      })
      fireEvent.click(settingsButton)

      // FINNISH IT UP!!
    })
  })
})
