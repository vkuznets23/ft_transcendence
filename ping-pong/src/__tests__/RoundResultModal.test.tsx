import { fireEvent, render, screen } from '@testing-library/react'
import { RoundResultModal } from '../components/ResetResultsModal'
import React from 'react'

describe('RoundResultModal', () => {
  const mockNextRound = jest.fn()

  beforeEach(() => {
    mockNextRound.mockReset()
  })

  it('shows winner and button', () => {
    render(
      <RoundResultModal
        winner="player1"
        onNextRound={mockNextRound}
        roundLabel="2"
      />
    )

    expect(screen.getByText(/round winner: player1/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /next round: 2/i })
    ).toBeInTheDocument()
    expect(screen.getByAltText(/winner/i)).toBeInTheDocument()
  })

  it('calls onNextRound when button is clicked', () => {
    render(
      <RoundResultModal
        winner="player1"
        onNextRound={mockNextRound}
        roundLabel="2"
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /next round: 2/i }))
    expect(mockNextRound).toHaveBeenCalledTimes(1)
  })

  it('does not render when winner is null', () => {
    const { container } = render(
      <RoundResultModal
        winner={null}
        onNextRound={mockNextRound}
        roundLabel="2"
      />
    )

    expect(container).toBeEmptyDOMElement()
  })
})
