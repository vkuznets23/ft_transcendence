/* eslint-disable testing-library/no-node-access */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { CasualGameModal } from '../components/CasualGameModal'

describe('CasualGameModal', () => {
  const mockPlayAgain = jest.fn()

  beforeEach(() => {
    mockPlayAgain.mockReset()
  })

  it('does not render when winner is null', () => {
    const { container } = render(
      <CasualGameModal
        winner={null}
        onPlayAgain={mockPlayAgain}
        opponentType="player"
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders winner info and image for player1', () => {
    render(
      <CasualGameModal
        winner="player1"
        onPlayAgain={mockPlayAgain}
        opponentType="player"
      />
    )

    expect(screen.getByText(/🏁 Round winner: player1/i)).toBeInTheDocument()
    const img = screen.getByAltText(/winner/i)
    expect(img).toBeInTheDocument()
    expect(img).toHaveClass('w-24', 'h-24')

    const button = screen.getByRole('button', { name: /play again/i })
    expect(button).toBeInTheDocument()
  })

  it('normalizes winner to playerAI when opponentType is ai and winner is player2', () => {
    render(
      <CasualGameModal
        winner="player2"
        onPlayAgain={mockPlayAgain}
        opponentType="ai"
      />
    )

    expect(screen.getByText(/🏁 Round winner: playerAI/i)).toBeInTheDocument()
  })

  it('calls onPlayAgain when Play Again button is clicked', () => {
    render(
      <CasualGameModal
        winner="player1"
        onPlayAgain={mockPlayAgain}
        opponentType="player"
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /play again/i }))
    expect(mockPlayAgain).toHaveBeenCalledTimes(1)
  })
})
