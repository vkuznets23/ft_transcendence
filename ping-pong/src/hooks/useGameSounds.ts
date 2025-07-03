import { useSounds } from './useSounds'

export const useGameSounds = () => {
  const { play, refs } = useSounds()
  return {
    playAddPoint: () => play(refs.addPoint),
    playGameOver: () => play(refs.gameOver),
    playGameStart: () => play(refs.gameStart),
    playPong: () => play(refs.pong),
  }
}
