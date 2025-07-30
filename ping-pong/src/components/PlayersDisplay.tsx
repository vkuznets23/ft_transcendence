import { HeartDisplay } from './Heartdisplay'
import trophyIcon from '../assets/images/winner.png'
import player1 from '../assets/images/playerLeft.png'
import player2 from '../assets/images/playerRight.png'
import playerAI from '../assets/images/playerAI.png'
import { IsTournament } from '../types/types'

interface PlayersDisplayProps {
  scoreLeft: number
  scoreRight: number
  opponentType: 'ai' | 'player'
  isMobile?: boolean
  children?: React.ReactNode
  showPlayer?: 'left' | 'right'
  gameMode?: IsTournament
  tournamentWinsLeft?: number
  tournamentWinsRight?: number
}

export const PlayersDisplay: React.FC<PlayersDisplayProps> = ({
  scoreLeft,
  scoreRight,
  opponentType,
  isMobile = false,
  children,
  showPlayer,
  gameMode,
  tournamentWinsLeft,
  tournamentWinsRight,
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
        <div className="flex flex-col items-left gap-1">
          <HeartDisplay score={scoreLeft} player="left" />
          {gameMode === 'tournament' && (
            <div className="flex items-center gap-1 mt-1">
              <img src={trophyIcon} alt="Trophy" className="h-[18px]" />
              <span className="text-white text-sm">
                {tournamentWinsRight ?? 0}
              </span>
            </div>
          )}
        </div>
      </div>

      <div>{children}</div>

      <div className="flex items-center gap-5">
        <div className="flex flex-col items-end gap-1">
          <HeartDisplay score={scoreRight} player="right" />
          {gameMode === 'tournament' && (
            <div className="flex items-center gap-1 mt-1">
              <img src={trophyIcon} alt="Trophy" className="h-[18px]" />
              <span className="text-white text-sm">
                {tournamentWinsLeft ?? 0}
              </span>
            </div>
          )}
        </div>
        {opponentType === 'ai' ? (
          <img src={playerAI} alt="player AI" className="h-[40px]" />
        ) : (
          <img src={player2} alt="player2" className="h-[40px]" />
        )}
      </div>
    </div>
  )
}
