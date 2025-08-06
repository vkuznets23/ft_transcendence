import { useRef, useEffect, useCallback } from 'react'

// UI Components
import GameSettingsModal from './TogglableModal'
import ControlsPanel from './ControllsPannel'
import PauseModal from './PauseModal'
import { getPlayerImage, PlayersDisplay } from './PlayersDisplay'

// Hooks
import { useGameSounds } from '../hooks/useGameSounds'
import { useGameLoop } from '../hooks/useGameLoop'
import { usePlayerControls } from '../hooks/usePlayerControls'
import { useAIPlayer } from '../hooks/useAIPlayer'
import { useGameState } from '../hooks/useGameStates'

// Utils
import { generateRandomObstacle } from '../utils/generateObstacle'
import { drawScene as externalDrawScene } from '../utils/drawScene'
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PADDLE_WIDTH,
  BALL_SIZE,
  MAX_SCORE,
  MAX_SPEED,
} from '../utils/constants'
import { resetBall } from '../utils/resetBall'
import type { PlayerID } from '../types/types'

type RoundResultModalProps = {
  winner: 'player1' | 'player2' | 'player3' | 'player4' | null
  // winner: 'player1' | 'player2' | null
  onNextRound: () => void
}
const RoundResultModal = ({ winner, onNextRound }: RoundResultModalProps) => {
  if (!winner) return null

  const winnerImage = getPlayerImage(winner)
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <div className="bg-gray-900 border-4 border-white-400 rounded-lg p-6 w-80 text-center">
        <p className="text-white mb-6 text-lg">Winner: {winner}</p>
        <img src={winnerImage} alt="winner" />
        <button
          onClick={onNextRound}
          className="bg-yellow-400 text-gray-900 font-semibold px-4 py-2 rounded hover:bg-yellow-300 transition"
        >
          Next round
        </button>
      </div>
    </div>
  )
}

const TournamentWinnerModal = ({
  tournamentWinner,
  finalStandings,
  onPlayAgain,
}: {
  tournamentWinner: PlayerID | null
  finalStandings: {
    first: string | null
    second: string | null
    third: string | null
    fourth: string | null
  }
  onPlayAgain: () => void
}) => {
  if (!tournamentWinner) return null

  const renderPlayer = (
    label: string,
    playerId: string | null,
    medal: string,
    fontSizeClass: string
  ) => {
    if (!playerId) return null
    return (
      <li className="flex items-center gap-4 mb-6">
        <span className={`${fontSizeClass} `}>
          {medal} {label}: {playerId}
        </span>
        <img
          src={getPlayerImage(playerId)}
          alt={playerId}
          className="w-6 h-6 "
        />
      </li>
    )
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <div className="bg-gray-900 border-4 border-white-400 rounded-lg p-8 w-100 text-center text-white space-y-6">
        <h2 className="w-full text-center text-3xl font-bold mb-4">
          🏆 Tournament results
        </h2>

        <ul className="">
          {renderPlayer('1st place', finalStandings.first, '🥇', 'text-2xl')}
          {renderPlayer('2nd place', finalStandings.second, '🥈', 'text-xl')}
          {renderPlayer('3rd place', finalStandings.third, '🥉', 'text-lg')}
          {renderPlayer('4th place', finalStandings.fourth, '🎖️', 'text-base')}
        </ul>
        <button
          onClick={onPlayAgain}
          className="bg-yellow-400 w-full text-gray-900 font-semibold px-4 py-2 rounded hover:bg-yellow-300 transition"
        >
          Play again
        </button>
      </div>
    </div>
  )
}

const PongGame = () => {
  // Global Game State
  const {
    finalStandings,
    tournamentWinner,
    finishCurrentMatch,
    tournament,
    setTournament,
    currentPlayerA,
    currentPlayerB,
    setTournamentWins,
    showRoundResultModal,
    setShowRoundResultModal,
    roundWinner,
    setRoundWinner,
    gameMode,
    setGameMode,
    isRunning,
    setIsRunning,
    showModal,
    setShowModal,
    gameOver,
    setGameOver,
    opponentType,
    setOpponentType,
    isSoundOn,
    setIsSoundOn,
    showPauseModal,
    setShowPauseModal,
    AIdifficulty,
    setAIDifficulty,
    paddleSizeOption,
    setPaddleSizeOption,
    difficulty,
    setDifficulty,
    score1State,
    setScore1State,
    score2State,
    setScore2State,
    obstacle,
    setObstacle,
    isRunningRef,
    paddleHeightRef,
    updatePaddleHeight,
  } = useGameState(CANVAS_WIDTH, CANVAS_HEIGHT)

  const { playAddPoint, playGameOver, playGameStart, playPong } =
    useGameSounds(isSoundOn)

  // Canvas reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Player control keys
  const {
    upPressed,
    downPressed,
    wPressed,
    sPressed,
    handleKeyDown,
    handleKeyUp,
  } = usePlayerControls()

  // Register keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  // Game references (positions, speed, etc.)
  const aiUpPressedRef = useRef(false)
  const aiDownPressedRef = useRef(false)

  const player1Y = useRef(CANVAS_HEIGHT / 2)
  const player2Y = useRef(CANVAS_HEIGHT / 2)

  const ballX = useRef(CANVAS_WIDTH / 2)
  const ballY = useRef(CANVAS_HEIGHT / 2)
  const ballSpeedX = useRef(5 * (Math.random() > 0.5 ? 1 : -1))
  const ballSpeedY = useRef(3 * (Math.random() > 0.5 ? 1 : -1))

  const score1 = useRef(0)
  const score2 = useRef(0)

  const rightPaddleYRef = player2Y
  const rightPaddleHeight = paddleHeightRef.current

  // Adjust paddle height based on screen orientation
  useEffect(() => {
    updatePaddleHeight()
    player1Y.current = Math.min(
      player1Y.current,
      CANVAS_HEIGHT - paddleHeightRef.current
    )
    player2Y.current = Math.min(
      player2Y.current,
      CANVAS_HEIGHT - paddleHeightRef.current
    )
  }, [paddleHeightRef, paddleSizeOption, updatePaddleHeight])

  // Obstacle generation for hard difficulty
  useEffect(() => {
    if (difficulty !== 'hard') return
    let intervalId: NodeJS.Timeout | null = null

    const maybeStartInterval = () => {
      if (isRunningRef.current) {
        intervalId = setInterval(() => {
          setObstacle(generateRandomObstacle(CANVAS_WIDTH, CANVAS_HEIGHT))
        }, 3000)
      }
    }

    maybeStartInterval()

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [difficulty, isRunning, isRunningRef, setObstacle])

  // Reset the ball to center
  const onResetBall = useCallback(
    (isRestart = false) => {
      resetBall(
        ballX,
        ballY,
        ballSpeedX,
        ballSpeedY,
        difficulty,
        setObstacle,
        isRestart
      )
    },
    [difficulty, setObstacle]
  )

  // Collision with obstacle
  const checkBallObstacleCollision = useCallback(() => {
    const currentObstacle = obstacle

    if (!currentObstacle) return

    const ballLeft = ballX.current - BALL_SIZE
    const ballRight = ballX.current + BALL_SIZE
    const ballTop = ballY.current - BALL_SIZE
    const ballBottom = ballY.current + BALL_SIZE

    const { x: ox, y: oy, width: ow, height: oh } = currentObstacle
    const obstacleLeft = ox
    const obstacleRight = ox + ow
    const obstacleTop = oy
    const obstacleBottom = oy + oh

    const isColliding =
      ballRight > obstacleLeft &&
      ballLeft < obstacleRight &&
      ballBottom > obstacleTop &&
      ballTop < obstacleBottom

    if (!isColliding) return

    const overlapLeft = ballRight - obstacleLeft
    const overlapRight = obstacleRight - ballLeft
    const overlapTop = ballBottom - obstacleTop
    const overlapBottom = obstacleBottom - ballTop

    const minOverlapX = Math.min(overlapLeft, overlapRight)
    const minOverlapY = Math.min(overlapTop, overlapBottom)

    if (minOverlapX < minOverlapY) {
      ballSpeedX.current *= -1
      if (Math.abs(ballSpeedX.current) > MAX_SPEED) {
        ballSpeedX.current = MAX_SPEED * Math.sign(ballSpeedX.current)
      }
      playPong()

      if (overlapLeft < overlapRight) {
        ballX.current = obstacleLeft - BALL_SIZE
      } else {
        ballX.current = obstacleRight + BALL_SIZE
      }
    } else {
      ballSpeedY.current *= -1
      if (Math.abs(ballSpeedX.current) > MAX_SPEED) {
        ballSpeedX.current = MAX_SPEED * Math.sign(ballSpeedX.current)
      }
      playPong()

      if (overlapTop < overlapBottom) {
        ballY.current = obstacleTop - BALL_SIZE
      } else {
        ballY.current = obstacleBottom + BALL_SIZE
      }
    }
  }, [obstacle, playPong])

  // Toggle pause/play
  const toggleRunning = useCallback(() => {
    const next = !isRunningRef.current
    isRunningRef.current = next
    setIsRunning(next)
    if (!next) {
      setShowPauseModal(true)
    } else {
      setShowPauseModal(false)
    }
  }, [isRunningRef, setIsRunning, setShowPauseModal])

  const handleContinueFromPause = () => {
    setShowPauseModal(false)
    toggleRunning()
  }

  const startGameFromModal = () => {
    playGameStart()

    if (gameMode === 'tournament') {
      setTournamentWins({ player1: 0, player2: 0, player3: 0, player4: 0 })
      setOpponentType('player')

      setTournament({
        matches: [
          {
            playerA: 'player1',
            playerB: 'player2',
            scoreA: 0,
            scoreB: 0,
            winner: null,
          },
          {
            playerA: 'player3',
            playerB: 'player4',
            scoreA: 0,
            scoreB: 0,
            winner: null,
          },
          { playerA: null, playerB: null, scoreA: 0, scoreB: 0, winner: null },
          {
            playerA: null,
            playerB: null,
            scoreA: 0,
            scoreB: 0,
            winner: null,
          },
        ],
        currentMatchIndex: 0,
        finished: false,
      })
    }

    score1.current = 0
    score2.current = 0
    setGameOver(false)
    setShowModal(false)
    onResetBall(true)
    setScore1State(0)
    setScore2State(0)
    setTimeout(() => {
      toggleRunning()
    }, 100)
  }

  // Update positions of all game elements
  const updatePositions = useCallback(() => {
    if (!isRunningRef.current) return

    // Player 1 movement with W/S
    if (wPressed.current) player1Y.current -= 7
    if (sPressed.current) player1Y.current += 7
    player1Y.current = Math.max(
      0,
      Math.min(player1Y.current, CANVAS_HEIGHT - paddleHeightRef.current)
    )

    // Player 2 movement with arrows (player or AI)
    if (opponentType === 'player') {
      if (upPressed.current) player2Y.current -= 7
      if (downPressed.current) player2Y.current += 7
    } else {
      if (aiUpPressedRef.current) player2Y.current -= 7
      if (aiDownPressedRef.current) player2Y.current += 7
    }
    player2Y.current = Math.max(
      0,
      Math.min(player2Y.current, CANVAS_HEIGHT - paddleHeightRef.current)
    )

    // Ball movement
    ballX.current += ballSpeedX.current
    ballY.current += ballSpeedY.current

    // Wall collision
    if (
      ballY.current - BALL_SIZE < 0 ||
      ballY.current + BALL_SIZE > CANVAS_HEIGHT
    ) {
      ballSpeedY.current *= -1
      if (Math.abs(ballSpeedX.current) > MAX_SPEED) {
        ballSpeedX.current = MAX_SPEED * Math.sign(ballSpeedX.current)
      }
      playPong()
    }

    // Paddle collisions
    const hitPaddle1 =
      ballX.current - BALL_SIZE < PADDLE_WIDTH &&
      ballY.current > player1Y.current &&
      ballY.current < player1Y.current + paddleHeightRef.current

    const hitPaddle2 =
      ballX.current + BALL_SIZE > CANVAS_WIDTH - PADDLE_WIDTH &&
      ballY.current > player2Y.current &&
      ballY.current < player2Y.current + paddleHeightRef.current
    if (hitPaddle1 || hitPaddle2) {
      ballSpeedX.current *= -1.05
      ballSpeedX.current =
        Math.sign(ballSpeedX.current) *
        Math.min(Math.abs(ballSpeedX.current), MAX_SPEED)
      ballX.current += hitPaddle1 ? 10 : -10
      playPong()
    }

    // Obstacle collision (for medium/hard difficulties)
    if (difficulty === 'hard' || difficulty === 'medium') {
      checkBallObstacleCollision()
    }

    // Scoring
    if (ballX.current < 0 || ballX.current > CANVAS_WIDTH) {
      const isPlayer1Goal = ballX.current > CANVAS_WIDTH
      const scorer = isPlayer1Goal ? score1 : score2
      const setScore = isPlayer1Goal ? setScore1State : setScore2State
      const score = ++scorer.current

      setScore(score)
      if (score >= MAX_SCORE) {
        isRunningRef.current = false
        setIsRunning(false)
        playGameOver()

        if (gameMode === 'tournament') {
          const winner = isPlayer1Goal ? currentPlayerA : currentPlayerB
          setRoundWinner(winner ?? null)
          setShowRoundResultModal(true)

          if (
            winner === 'player1' ||
            winner === 'player2' ||
            winner === 'player3' ||
            winner === 'player4'
          ) {
            finishCurrentMatch(winner)
          }
        }
      } else {
        playAddPoint()
        onResetBall()
      }
    }
  }, [
    isRunningRef,
    wPressed,
    sPressed,
    paddleHeightRef,
    opponentType,
    difficulty,
    upPressed,
    downPressed,
    playPong,
    checkBallObstacleCollision,
    setScore1State,
    setScore2State,
    setIsRunning,
    playGameOver,
    gameMode,
    currentPlayerA,
    currentPlayerB,
    setRoundWinner,
    setShowRoundResultModal,
    finishCurrentMatch,
    playAddPoint,
    onResetBall,
  ])

  useEffect(() => {
    console.log('roundWinner changed:', roundWinner)
  }, [roundWinner])

  // Drawing function
  const drawScene = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      externalDrawScene({
        ctx,
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        paddleWidth: PADDLE_WIDTH,
        paddleHeight: paddleHeightRef.current,
        ballSize: BALL_SIZE,
        score1: score1.current,
        score2: score2.current,
        player1Y: player1Y.current,
        player2Y: player2Y.current,
        ballX: ballX.current,
        ballY: ballY.current,
        difficulty,
        obstacle: obstacle || undefined,
      })
    },
    [paddleHeightRef, difficulty, obstacle]
  )

  useGameLoop({
    canvasRef,
    isRunningRef,
    drawScene,
    updatePositions,
    handleKeyDown,
    handleKeyUp,
  })

  useEffect(() => {
    const handleSpaceToggle = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        if (!showModal) toggleRunning()
      }
    }

    window.addEventListener('keydown', handleSpaceToggle)
    return () => {
      window.removeEventListener('keydown', handleSpaceToggle)
    }
  }, [showModal, toggleRunning])

  // AI logic
  useAIPlayer({
    isRunningRef,
    AIdifficulty,
    playerYRef: rightPaddleYRef,
    paddleHeight: rightPaddleHeight,
    ballX,
    ballY,
    ballSpeedX,
    ballSpeedY,
    setUpPressed: (val) => {
      aiUpPressedRef.current = val
    },
    setDownPressed: (val) => {
      aiDownPressedRef.current = val
    },
    enabled: opponentType === 'ai',
  })

  console.log('Winner ID:', tournament?.matches[2]?.winner)

  return (
    <div className="flex flex-col items-center gap-6 p-6 min-h-screen">
      <GameSettingsModal
        buttonText={
          gameMode === 'tournament' ? 'Start tournament' : 'Start the game'
        }
        show={showModal || gameOver}
        isRunning={isRunning}
        paddleSizeOption={paddleSizeOption}
        difficulty={difficulty}
        AIdifficulty={AIdifficulty}
        opponentType={opponentType}
        onOpponentTypeChange={setOpponentType}
        onPaddleSizeChange={setPaddleSizeOption}
        onDifficultyChange={setDifficulty}
        onAIDifficultyChange={setAIDifficulty}
        onStart={startGameFromModal}
        isTournament={gameMode}
        setIsTournament={setGameMode}
      />

      {showPauseModal && <PauseModal onContinue={handleContinueFromPause} />}
      {showRoundResultModal &&
        (tournament.finished && tournament.matches[2].winner ? (
          <TournamentWinnerModal
            onPlayAgain={() => {
              setShowRoundResultModal(false)
              setShowModal(true)
              setGameOver(true)
              setRoundWinner(null)
            }}
            tournamentWinner={tournamentWinner}
            finalStandings={finalStandings}
          />
        ) : (
          <RoundResultModal
            winner={roundWinner}
            onNextRound={() => {
              setShowRoundResultModal(false)
              onResetBall(true)
              isRunningRef.current = true
              setIsRunning(true)
              setShowPauseModal(false)

              score1.current = 0
              score2.current = 0
              setScore1State(0)
              setScore2State(0)
              setRoundWinner(null)
            }}
          />
        ))}

      <div className="flex items-center gap-10">
        <PlayersDisplay
          scoreLeft={score2State}
          scoreRight={score1State}
          opponentType={opponentType}
          gameMode={gameMode}
          playerLeftId={currentPlayerA ?? undefined}
          playerRightId={currentPlayerB ?? undefined}
        >
          <ControlsPanel
            isRunning={isRunning}
            onToggleRunning={toggleRunning}
            onRestart={() => {
              isRunningRef.current = false
              setIsRunning(false)
              setGameOver(false)
              setShowModal(true)
            }}
            disabled={showModal}
            isSoundOn={isSoundOn}
            onToggleSound={() => setIsSoundOn((prev) => !prev)}
          />
        </PlayersDisplay>
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-8 border-white  rounded-md"
      />
    </div>
  )
}

export default PongGame
