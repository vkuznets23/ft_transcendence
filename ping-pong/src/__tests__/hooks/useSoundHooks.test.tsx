import { renderHook } from '@testing-library/react'
import { useSounds } from '../../hooks/useSounds'
import { useGameSounds } from '../../hooks/useGameSounds'

jest.mock('../../hooks/useSounds')

test('playAddPoint plays sound when sound is on', () => {
  const playMock = jest.fn()
  const refsMock = {
    addPoint: 'addPointSound',
    gameOver: 'gameOverSound',
    gameStart: 'gameStartSound',
    pong: 'pongSound',
  }
  ;(useSounds as jest.Mock).mockReturnValue({ play: playMock, refs: refsMock })

  const { result } = renderHook(() => useGameSounds(true))

  result.current.playAddPoint()
  expect(playMock).toHaveBeenCalledWith(refsMock.addPoint)
})
