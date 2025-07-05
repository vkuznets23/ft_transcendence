import { useSounds } from './useSounds'

export const useGameSounds = (isSoundOn: boolean) => {
  const { play, refs } = useSounds()

  return {
    playAddPoint: () => {
      if (!isSoundOn) return
      play(refs.addPoint)
    },
    playGameOver: () => {
      if (!isSoundOn) return
      play(refs.gameOver)
    },
    playGameStart: () => {
      if (!isSoundOn) return
      play(refs.gameStart)
    },
    playPong: () => {
      if (!isSoundOn) return
      play(refs.pong)
    },
  }
}
