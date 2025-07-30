import { HeartDisplay } from './Heartdisplay'
// import trophyIcon from '../assets/images/winner.png'
import player1 from '../assets/images/playerLeft.png'
import player2 from '../assets/images/playerRight.png'
import player3 from '../assets/images/player3.png'
import player4 from '../assets/images/player4.png'
import playerAI from '../assets/images/playerAI.png'
import { IsTournament } from '../types/types'

const getPlayerImage = (id: string | undefined) => {
  switch (id) {
    case 'playerAI':
      return playerAI
    case 'player1':
      return player1
    case 'player2':
      return player2
    case 'player3':
      return player3
    case 'player4':
      return player4
    default:
      return player1 // fallback
  }
}

interface PlayersDisplayProps {
  scoreLeft: number
  scoreRight: number
  opponentType: 'ai' | 'player'
  isMobile?: boolean
  children?: React.ReactNode
  showPlayer?: 'left' | 'right'
  gameMode?: IsTournament
  playerLeftId?: 'player1' | 'player2' | 'player3' | 'player4'
  playerRightId?: 'player1' | 'player2' | 'player3' | 'player4'
}

export const PlayersDisplay: React.FC<PlayersDisplayProps> = ({
  scoreLeft,
  scoreRight,
  opponentType,
  isMobile = false,
  children,
  showPlayer,
  gameMode,
  playerLeftId,
  playerRightId,
}) => {
  if (isMobile) {
    const isLeft = showPlayer === 'left'
    const rightPlayerImg =
      opponentType === 'ai' ? playerAI : getPlayerImage(playerRightId)

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
        <img
          src={getPlayerImage(playerLeftId)}
          alt="player left"
          className="h-[40px]"
        />
        <div className="flex flex-col items-left gap-1">
          <HeartDisplay score={scoreLeft} player="left" />
        </div>
      </div>

      <div>{children}</div>

      <div className="flex items-center gap-5">
        <div className="flex flex-col items-end gap-1">
          <HeartDisplay score={scoreRight} player="right" />
        </div>
        <img
          src={getPlayerImage(
            opponentType === 'ai' ? 'playerAI' : playerRightId
          )}
          alt="player right"
          className="h-[40px]"
        />
      </div>
    </div>
  )
}
