import React from 'react'
import { render, screen } from '@testing-library/react'
import { PlayersDisplay } from '../components/PlayersDisplay'

jest.mock('../components/Heartdisplay', () => ({
  HeartDisplay: ({ score, player }: { score: number; player: string }) => (
    <div data-testid={`heart-display-${player}`}>Score: {score}</div>
  ),
}))

describe('PlayersDisplay', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders player images and heart displays in desktop mode', () => {
    render(
      <PlayersDisplay
        scoreLeft={3}
        scoreRight={5}
        opponentType="player"
        playerLeftId="player1"
        playerRightId="player2"
      >
        <div>Child content</div>
      </PlayersDisplay>
    )
    // check left one and rigth one
    const leftImg = screen.getByAltText(/player left/i)
    expect(leftImg).toBeInTheDocument()

    const rightImg = screen.getByAltText(/player right/i)
    expect(rightImg).toBeInTheDocument()

    expect(screen.getByTestId('heart-display-left')).toHaveTextContent(
      'Score: 3'
    )
    expect(screen.getByTestId('heart-display-right')).toHaveTextContent(
      'Score: 5'
    )

    expect(screen.getByText(/child content/i)).toBeInTheDocument()
  })

  it('renders correctly in mobile mode showing left player', () => {
    render(
      <PlayersDisplay
        scoreLeft={1}
        scoreRight={2}
        opponentType="ai"
        isMobile={true}
        showPlayer="left"
        playerLeftId="player3"
        playerRightId="player4"
      >
        <div>Mobile left content</div>
      </PlayersDisplay>
    )

    const leftImg = screen.getByAltText(/player1/i)
    expect(leftImg).toBeInTheDocument()

    expect(screen.getByTestId('heart-display-left')).toHaveTextContent(
      'Score: 1'
    )

    expect(screen.getByText(/mobile left content/i)).toBeInTheDocument()
  })

  it('renders correctly in mobile mode showing right player with AI opponent', () => {
    render(
      <PlayersDisplay
        scoreLeft={0}
        scoreRight={4}
        opponentType="ai"
        isMobile={true}
        showPlayer="right"
        playerLeftId="player1"
        playerRightId="player2"
      >
        <div>Mobile right content</div>
      </PlayersDisplay>
    )

    const rightImg = screen.getByAltText(/player2 or AI/i)
    expect(rightImg).toBeInTheDocument()

    expect(screen.getByTestId('heart-display-right')).toHaveTextContent(
      'Score: 4'
    )

    expect(screen.getByText(/mobile right content/i)).toBeInTheDocument()
  })

  it('renders AI image on right when opponentType is ai and not tournament mode', () => {
    render(
      <PlayersDisplay
        scoreLeft={0}
        scoreRight={0}
        opponentType="ai"
        gameMode="CasualGame"
        playerLeftId="player1"
        playerRightId="player2"
      >
        <div>Test content</div>
      </PlayersDisplay>
    )

    const rightImg = screen.getByAltText(/player right/i)
    expect(rightImg).toBeInTheDocument()
    expect(rightImg.getAttribute('src')).toContain('playerAI')
  })

  it('renders player image on right when gameMode is tournament', () => {
    render(
      <PlayersDisplay
        scoreLeft={0}
        scoreRight={0}
        opponentType="ai"
        gameMode="tournament"
        playerLeftId="player1"
        playerRightId="player4"
      >
        <div>Test content</div>
      </PlayersDisplay>
    )

    const rightImg = screen.getByAltText(/player right/i)
    expect(rightImg).toBeInTheDocument()
    expect(rightImg.getAttribute('src')).toContain('player4')
  })
})
