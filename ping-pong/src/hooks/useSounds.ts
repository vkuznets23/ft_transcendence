import { useRef, useEffect } from 'react'

export const useSounds = () => {
  const addPoint = useRef<HTMLAudioElement | null>(null)
  const gameOver = useRef<HTMLAudioElement | null>(null)
  const gameStart = useRef<HTMLAudioElement | null>(null)
  const pong = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    addPoint.current = new Audio('/sounds/addPoint.mp3')
    gameStart.current = new Audio('/sounds/gameStart.mp3')
    gameOver.current = new Audio('/sounds/gameOver.mp3')
    pong.current = new Audio('/sounds/pong.mp3')
  }, [])

  const play = (soundRef: React.MutableRefObject<HTMLAudioElement | null>) => {
    const sound = soundRef.current
    if (!sound) return
    sound.pause()
    sound.currentTime = 0
    sound.play()
  }

  return {
    refs: { addPoint, gameOver, gameStart, pong },
    play,
  }
}
