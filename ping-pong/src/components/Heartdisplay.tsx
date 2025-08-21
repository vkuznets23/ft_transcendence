import heartFull from '../assets/images/heartFull.png'
import heartEmpty from '../assets/images/heartEmpty.png'
import { MAX_SCORE } from '../utils/constants'

type player = 'left' | 'right'

export const HeartDisplay: React.FC<{ score: number; player: player }> = ({
  score,
  player,
}) => {
  const hearts = []

  if (player === 'left') {
    for (let i = MAX_SCORE; i > 0; i--) {
      const isFull = i <= MAX_SCORE - score
      hearts.push(
        <img
          key={i}
          src={isFull ? heartFull : heartEmpty}
          alt="heart"
          className="h-[15px] w-[15px] mx-1"
        />
      )
    }

    return <div className="flex flex-row-reverse">{hearts}</div>
  }
  for (let i = 0; i < MAX_SCORE; i++) {
    const isFull = i < MAX_SCORE - score
    hearts.push(
      <img
        key={i}
        src={isFull ? heartFull : heartEmpty}
        alt={isFull ? 'full heart' : 'empty heart'}
        className="h-[15px] w-[15px] mx-1"
      />
    )
  }

  return (
    <div
      aria-label={`Player ${player} score: ${
        MAX_SCORE - score
      } out of ${MAX_SCORE}`}
      className="flex flex-row-reverse"
    >
      {hearts}
    </div>
  )
}
