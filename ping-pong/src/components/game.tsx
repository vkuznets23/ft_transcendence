import { useRef, useEffect, useCallback, useState } from 'react'

// UI Components
import GameSettingsModal from './TogglableModal'
import ControlsPanel from './ControllsPannel'
import PauseModal from './PauseModal'
import { PlayersDisplay } from './PlayersDisplay'
import { RoundResultModal } from './ResetResultsModal'
import { TournamentWinnerModal } from './TournamentsWinnerModel'
import { CasualGameModal } from './CasualGameModal'

// Hooks
import { useGameSounds } from '../hooks/useGameSounds'
import { useGameLoop } from '../hooks/useGameLoop'
import { usePlayerControls } from '../hooks/usePlayerControls'
import { useAIPlayer } from '../hooks/useAIPlayer'
import { useGameState } from '../hooks/useGameStates'
import { useGameInitializer } from '../hooks/useGameInitializer'
import { useLiveAnnouncer } from '../hooks/useVoiceOver'

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
import { getRoundLabel } from '../utils/getRoundLabel'

//localStorage
import { loadStats, saveStats } from '../utils/statistic'

const PongGame = () => {
  // Global Game State
  const {
    playerAliases,
    setPlayerAliases,
    setCurrentPlayerA,
    setCurrentPlayerB,
    finalStandings,
    setFinalStandings,
    tournamentWinner,
    setTournamentWinner,
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

  const announcement = useLiveAnnouncer(score1State, score2State)

  const [showCasualGameModal, setShowCasualGameModal] = useState(false)
  const [casualWinner, setCasualWinner] = useState<
    'player1' | 'player2' | null
  >(null)

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

  const resetPaddlesPosition = useCallback(() => {
    const centerY = CANVAS_HEIGHT / 2 - paddleHeightRef.current / 2
    player1Y.current = centerY
    player2Y.current = centerY
  }, [paddleHeightRef])

  const initializeGame = useGameInitializer({
    playGameStart,
    resetPaddlesPosition,
    setTournamentWinner,
    setFinalStandings,
    setRoundWinner,
    setShowPauseModal,
    setShowRoundResultModal,
    setTournamentWins,
    setOpponentType,
    setTournament,
    setCurrentPlayerA,
    setCurrentPlayerB,
    setGameOver,
    setShowModal,
    onResetBall,
    setScore1State,
    setScore2State,
    toggleRunning,
    score1Ref: score1,
    score2Ref: score2,
  })

  const startGameFromModal = () => initializeGame(gameMode)

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

      setCasualWinner(isPlayer1Goal ? 'player1' : 'player2')

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
        } else {
          setShowCasualGameModal(true)

          // --- Update localStorage stats
          const stats = loadStats()
          stats.casual.totalGames += 1
          if (opponentType === 'ai') {
            stats.casual.ai += 1
          } else if (isPlayer1Goal) {
            stats.casual.player1 += 1
          } else {
            stats.casual.player2 += 1
          }
          saveStats(stats)
        }
      } else {
        playAddPoint()
        onResetBall()
        resetPaddlesPosition()
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
    resetPaddlesPosition,
  ])

  useEffect(() => {
    if (showRoundResultModal && tournament.finished) {
      const finalMatch = tournament.matches[tournament.matches.length - 1]

      if (finalMatch?.winner) {
        const stats = loadStats()
        const winner = finalMatch.winner

        if (
          winner === 'player1' ||
          winner === 'player2' ||
          winner === 'player3' ||
          winner === 'player4'
        ) {
          stats.tournament[winner] += 1
          stats.tournament.totalTournaments += 1
          saveStats(stats)
        }
      }
    }
  }, [showRoundResultModal, tournament])

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
        if (
          !showModal &&
          !showRoundResultModal &&
          !showPauseModal &&
          !showCasualGameModal
        ) {
          toggleRunning()
        }
      }
    }

    window.addEventListener('keydown', handleSpaceToggle)
    return () => {
      window.removeEventListener('keydown', handleSpaceToggle)
    }
  }, [
    showCasualGameModal,
    showModal,
    showPauseModal,
    showRoundResultModal,
    toggleRunning,
  ])

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

  const onNextRound = () => {
    setShowRoundResultModal(false)
    onResetBall(true)
    isRunningRef.current = true
    setIsRunning(true)
    setShowPauseModal(false)

    resetPaddlesPosition()
    score1.current = 0
    score2.current = 0
    setScore1State(0)
    setScore2State(0)
    setRoundWinner(null)
  }

  const winnerAlias = roundWinner ? playerAliases[roundWinner] ?? null : null

  return (
    <div
      className="flex flex-col items-center gap-6 p-6 min-h-screen"
      role="main"
      data-testid="pong-game-root"
    >
      {/* DELETE */}
      <button
        aria-label="Show stats for developers"
        data-testid="dev-show-stats-btn"
        onClick={() => {
          const stats = loadStats()
          console.log('Current stats:', stats)
        }}
        className="text-white border px-4 py-1 rounded"
      >
        Show Stats (Dev)
      </button>
      {/* DELETE */}

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
        playerAliases={playerAliases}
        setPlayerAliases={setPlayerAliases}
      />

      {showPauseModal && <PauseModal onContinue={handleContinueFromPause} />}
      {showCasualGameModal && (
        <CasualGameModal
          winner={casualWinner}
          onPlayAgain={() => {
            setShowModal(true)
            setGameOver(true)
            setShowCasualGameModal(false)
          }}
          opponentType={opponentType}
        />
      )}
      {showRoundResultModal &&
        (tournament.finished && tournament.matches[2].winner ? (
          <TournamentWinnerModal
            onPlayAgain={() => {
              setShowRoundResultModal(false)
              setShowModal(true)
              setGameOver(true)
              setRoundWinner(null)
              setPlayerAliases({
                player1: '',
                player2: '',
                player3: '',
                player4: '',
              })
            }}
            playerAliases={playerAliases}
            tournamentWinner={tournamentWinner}
            finalStandings={finalStandings}
          />
        ) : (
          <RoundResultModal
            winner={roundWinner}
            winnerAlias={winnerAlias}
            onNextRound={onNextRound}
            roundLabel={getRoundLabel(tournament.currentMatchIndex)}
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
              setPlayerAliases({
                player1: '',
                player2: '',
                player3: '',
                player4: '',
              })
            }}
            disabled={showModal}
            isSoundOn={isSoundOn}
            onToggleSound={() => setIsSoundOn((prev) => !prev)}
          />
        </PlayersDisplay>
      </div>
      <canvas
        data-testid="canvas"
        role="img"
        aria-label="Game area"
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-8 border-white  rounded-md"
      />

      <div
        aria-live="polite"
        role="status"
        data-testid="live-announcer"
        className="sr-only"
      >
        {announcement}
      </div>
    </div>
  )
}

export default PongGame
