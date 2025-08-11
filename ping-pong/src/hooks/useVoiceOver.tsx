import { useEffect, useRef, useState } from 'react'

export function useLiveAnnouncer(score1: number, score2: number) {
  const [announcement, setAnnouncement] = useState('')
  const prevScore1 = useRef(score1)
  const prevScore2 = useRef(score2)

  useEffect(() => {
    const prev1 = prevScore1.current
    const prev2 = prevScore2.current

    if (score1 > prev1) {
      setAnnouncement(
        `Left player scored! The score is now ${score1} to ${score2}.`
      )
    } else if (score2 > prev2) {
      setAnnouncement(
        `Right player scored! The score is now ${score1} to ${score2}.`
      )
    }

    prevScore1.current = score1
    prevScore2.current = score2
  }, [score1, score2])

  return announcement
}
