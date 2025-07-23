import { HeartDisplay } from './Heartdisplay'
import player1 from '../assets/images/playerLeft.png'
import player2 from '../assets/images/playerRight.png'
import playerAI from '../assets/images/playerAI.png'

interface PlayersDisplayProps {
  scoreLeft: number
  scoreRight: number
  opponentType: 'ai' | 'player'
  isMobile?: boolean
  children?: React.ReactNode
  showPlayer?: 'left' | 'right'
}

export const PlayersDisplay: React.FC<PlayersDisplayProps> = ({
  scoreLeft,
  scoreRight,
  opponentType,
  isMobile = false,
  children,
  showPlayer,
}) => {
  if (isMobile) {
    const isLeft = showPlayer === 'left'
    const rightPlayerImg = opponentType === 'ai' ? playerAI : player2

    return (
      <div className="flex items-center justify-between w-full max-w-4xl px-4 gap-2">
        {isLeft ? (
          <>
            <div className="flex items-center gap-2">
              <img src={player1} alt="player1" className="h-[40px]" />
              <HeartDisplay score={scoreLeft} player="left" />
            </div>
            <div>{children}</div>
          </>
        ) : (
          <>
            <div>{children}</div>
            <div className="flex items-center gap-2">
              <HeartDisplay score={scoreRight} player="right" />
              <img
                src={rightPlayerImg}
                alt="player2 or AI"
                className="h-[40px]"
              />
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between w-full max-w-4xl px-4 gap-10">
      <div className="flex items-center gap-5">
        <img src={player1} alt="player1" className="h-[40px]" />
        <HeartDisplay score={scoreLeft} player="left" />
      </div>

      <div>{children}</div>

      <div className="flex items-center gap-5">
        <HeartDisplay score={scoreRight} player="right" />
        {opponentType === 'ai' ? (
          <img src={playerAI} alt="player AI" className="h-[40px]" />
        ) : (
          <img src={player2} alt="player2" className="h-[40px]" />
        )}
      </div>
    </div>
  )
}
