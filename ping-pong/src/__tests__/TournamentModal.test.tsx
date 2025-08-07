/* eslint-disable testing-library/no-node-access */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { TournamentWinnerModal } from '../components/TournamentsWinnerModel'

describe('TournamentWinnerModal', () => {
  const mockPlayAgain = jest.fn()

  const finalStandings = {
    first: 'player1',
    second: 'player2',
    third: 'player3',
    fourth: 'player4',
  }

  beforeEach(() => {
    mockPlayAgain.mockReset()
  })

  it('does not render if tournamentWinner is null', () => {
    const { container } = render(
      <TournamentWinnerModal
        tournamentWinner={null}
        finalStandings={finalStandings}
        onPlayAgain={mockPlayAgain}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders tournament results with players and medals', () => {
    render(
      <TournamentWinnerModal
        tournamentWinner="player1"
        finalStandings={finalStandings}
        onPlayAgain={mockPlayAgain}
      />
    )

    expect(screen.getByText(/🏆 Tournament results/i)).toBeInTheDocument()

    expect(screen.getByText(/🥇 1st place: player1/i)).toBeInTheDocument()
    expect(screen.getByAltText('player1')).toBeInTheDocument()

    expect(screen.getByText(/🥈 2nd place: player2/i)).toBeInTheDocument()
    expect(screen.getByAltText('player2')).toBeInTheDocument()

    expect(screen.getByText(/🥉 3rd place: player3/i)).toBeInTheDocument()
    expect(screen.getByAltText('player3')).toBeInTheDocument()

    expect(screen.getByText(/🎖️ 4th place: player4/i)).toBeInTheDocument()
    expect(screen.getByAltText('player4')).toBeInTheDocument()
  })

  it('does not render list items for null players in finalStandings', () => {
    const partialStandings = {
      first: 'player1',
      second: null,
      third: 'player3',
      fourth: null,
    }

    render(
      <TournamentWinnerModal
        tournamentWinner="player1"
        finalStandings={partialStandings}
        onPlayAgain={mockPlayAgain}
      />
    )

    expect(screen.getByText(/🥇 1st place: player1/i)).toBeInTheDocument()
    expect(screen.queryByText(/2nd place/)).toBeNull()
    expect(screen.getByText(/🥉 3rd place: player3/i)).toBeInTheDocument()
    expect(screen.queryByText(/4th place/)).toBeNull()
  })

  it('calls onPlayAgain when button is clicked', () => {
    render(
      <TournamentWinnerModal
        tournamentWinner="player1"
        finalStandings={finalStandings}
        onPlayAgain={mockPlayAgain}
      />
    )

    const button = screen.getByRole('button', { name: /play again/i })
    fireEvent.click(button)
    expect(mockPlayAgain).toHaveBeenCalledTimes(1)
  })
})
