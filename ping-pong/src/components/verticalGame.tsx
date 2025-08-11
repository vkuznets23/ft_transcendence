import React, { useRef, useCallback, useState, useEffect } from 'react'

// UI Components
import GameSettingsModal from './TogglableModal'
import ControlsPanel from './ControllsPannel'
import PauseModal from './PauseModal'
import { PlayersDisplay } from './PlayersDisplay'
import { RoundResultModal } from './ResetResultsModal'
import { TournamentWinnerModal } from './TournamentsWinnerModel'
import { CasualGameModal } from './CasualGameModal'

// Hooks
import { useGameLoop } from '../hooks/useGameLoop'
import { useGameSounds } from '../hooks/useGameSounds'
import { useGameState } from '../hooks/useGameStates'
import { useAIPlayerVertical } from '../hooks/useAIPlayer'
import { usePlayerTouchControls } from '../hooks/usePlayerTouchControls'
import { useGameInitializer } from '../hooks/useGameInitializer'
import { useLiveAnnouncer } from '../hooks/useVoiceOver'

// Utils
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PADDLE_WIDTH,
  BALL_SIZE,
  MAX_SCORE,
  PADDLE_HEIGHT_MAP,
} from '../utils/constants'
import { generateRandomObstacle } from '../utils/generateObstacle'
import { drawVerticalScene } from '../utils/drawVerticalScene'
import { getRoundLabel } from '../utils/getRoundLabel'

//localStorage
import { loadStats, saveStats } from '../utils/statistic'

const VERTICAL_CANVAS_WIDTH = CANVAS_HEIGHT
const VERTICAL_CANVAS_HEIGHT = CANVAS_WIDTH

const VerticalPongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [canvasSize, setCanvasSize] = useState({
    width: VERTICAL_CANVAS_WIDTH,
    height: VERTICAL_CANVAS_HEIGHT,
  })

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
  } = useGameState(canvasSize.width, canvasSize.height)

  const announcement = useLiveAnnouncer(score1State, score2State)

  const [showCasualGameModal, setShowCasualGameModal] = useState(false)
  const [casualWinner, setCasualWinner] = useState<
    'player1' | 'player2' | null
  >(null)

  const { playAddPoint, playGameOver, playGameStart, playPong } =
    useGameSounds(isSoundOn)

  // Game references (positions, speed, etc.)
  const player1X = useRef(canvasSize.width / 2)
  const player2X = useRef(canvasSize.width / 2)

  const ballX = useRef(canvasSize.width / 2)
  const ballY = useRef(canvasSize.height / 2)
  const ballSpeedX = useRef(3 * (Math.random() > 0.5 ? 1 : -1))
  const ballSpeedY = useRef(5 * (Math.random() > 0.5 ? 1 : -1))

  const score1 = useRef(0)
  const score2 = useRef(0)

  const paddleWidth = PADDLE_HEIGHT_MAP[paddleSizeOption]

  const aiUpPressedRef = useRef(false)
  const aiDownPressedRef = useRef(false)

  const rightPaddleYRef = player1X
  const rightPaddleHeight = paddleHeightRef.current

  // touch controllers
  const { player1TouchX, player2TouchX } = usePlayerTouchControls(canvasRef)

  // Adjust paddle height based on screen orientation
  useEffect(() => {
    updatePaddleHeight()
    const maxPosition = canvasSize.width - paddleHeightRef.current

    player1X.current = Math.min(player1X.current, maxPosition)
    player2X.current = Math.min(player2X.current, maxPosition)
  }, [paddleSizeOption, canvasSize.width, updatePaddleHeight, paddleHeightRef])

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth
      const width = Math.min(screenWidth - 32, VERTICAL_CANVAS_WIDTH) - 10
      const height = (VERTICAL_CANVAS_HEIGHT / VERTICAL_CANVAS_WIDTH) * width

      setCanvasSize({ width, height })
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Obstacle generation for hard difficulty
  useEffect(() => {
    if (difficulty !== 'hard') return

    let intervalId: NodeJS.Timeout | null = null

    const maybeStartInterval = () => {
      if (isRunningRef.current) {
        intervalId = setInterval(() => {
          setObstacle(
            generateRandomObstacle(canvasSize.width, canvasSize.height)
          )
        }, 3000)
      }
    }

    maybeStartInterval()

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [
    canvasSize.height,
    canvasSize.width,
    difficulty,
    isRunning,
    isRunningRef,
    setObstacle,
  ])

  // Reset the ball to center
  const onResetBall = useCallback(() => {
    ballX.current = canvasSize.width / 2
    ballY.current = canvasSize.height / 2
    ballSpeedX.current = 3 * (Math.random() > 0.5 ? 1 : -1)
    ballSpeedY.current = 5 * (Math.random() > 0.5 ? 1 : -1)

    if (difficulty === 'medium' || difficulty === 'hard') {
      setObstacle(generateRandomObstacle(canvasSize.width, canvasSize.height))
    } else {
      setObstacle(null)
    }
  }, [canvasSize.height, canvasSize.width, difficulty, setObstacle])

  // Collision with obstacle
  const checkBallObstacleCollision = useCallback(() => {
    const currentObstacle = obstacle

    const ballLeft = ballX.current - BALL_SIZE
    const ballRight = ballX.current + BALL_SIZE
    const ballTop = ballY.current - BALL_SIZE
    const ballBottom = ballY.current + BALL_SIZE

    if (!currentObstacle) return
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
      playPong()

      if (overlapLeft < overlapRight) {
        ballX.current = obstacleLeft - BALL_SIZE
      } else {
        ballX.current = obstacleRight + BALL_SIZE
      }
    } else {
      ballSpeedY.current *= -1
      playPong()

      if (overlapTop < overlapBottom) {
        ballY.current = obstacleTop - BALL_SIZE
      } else {
        ballY.current = obstacleBottom + BALL_SIZE
      }
    }
  }, [obstacle, playPong])

  const resetPaddlesPosition = useCallback(() => {
    const centerX = canvasSize.width / 2 - paddleHeightRef.current / 2
    player1X.current = centerX
    player2X.current = centerX
  }, [canvasSize.width, paddleHeightRef])

  // Update positions of all game elements
  const updatePositions = useCallback(() => {
    if (!isRunningRef.current) return

    // Player 1
    if (player2TouchX.current !== null) {
      player2X.current = Math.min(
        Math.max(player2TouchX.current - paddleWidth / 2, 0),
        canvasSize.width - paddleWidth
      )
    }

    // Player 2 or AI
    if (opponentType === 'player') {
      if (player1TouchX.current !== null) {
        player1X.current = Math.min(
          Math.max(player1TouchX.current - paddleWidth / 2, 0),
          canvasSize.width - paddleWidth
        )
      }
    }

    if (opponentType === 'ai') {
      if (aiUpPressedRef.current) {
        player1X.current = Math.max(player1X.current - 5, 0)
      } else if (aiDownPressedRef.current) {
        player1X.current = Math.min(
          player1X.current + 5,
          canvasSize.width - paddleWidth
        )
      }
    }

    // Ball movement
    ballX.current += ballSpeedX.current
    ballY.current += ballSpeedY.current

    // Wall collision
    if (
      ballX.current - BALL_SIZE < 0 ||
      ballX.current + BALL_SIZE > canvasSize.width
    ) {
      ballSpeedX.current *= -1
      playPong()
    }

    // Paddle collisions
    const hitPaddle1 =
      ballY.current - BALL_SIZE < PADDLE_WIDTH &&
      ballX.current > player1X.current &&
      ballX.current < player1X.current + paddleWidth
    const hitPaddle2 =
      ballY.current + BALL_SIZE > canvasSize.height - PADDLE_WIDTH &&
      ballX.current > player2X.current &&
      ballX.current < player2X.current + paddleWidth
    if (hitPaddle1) {
      ballSpeedY.current *= -1.05
      ballY.current = PADDLE_WIDTH + BALL_SIZE
      playPong()
    }

    if (hitPaddle2) {
      ballSpeedY.current *= -1.05
      ballY.current = canvasSize.height - PADDLE_WIDTH - BALL_SIZE
      playPong()
    }

    // Obstacle collision (for medium/hard difficulties)
    if (difficulty === 'hard' || difficulty === 'medium') {
      checkBallObstacleCollision()
    }

    // Scoring
    if (ballY.current < 0 || ballY.current > canvasSize.height) {
      const isPlayer1Goal = ballY.current > canvasSize.height
      const scorerRef = isPlayer1Goal ? score1 : score2
      const setScore = isPlayer1Goal ? setScore1State : setScore2State

      scorerRef.current += 1
      const score = scorerRef.current

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
    player2TouchX,
    opponentType,
    canvasSize.width,
    canvasSize.height,
    paddleWidth,
    difficulty,
    player1TouchX,
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
      drawVerticalScene({
        ctx,
        width: canvasSize.width,
        height: canvasSize.height,
        paddleWidth,
        ballSize: BALL_SIZE,
        score1: score1.current,
        score2: score2.current,
        player1X: player1X.current,
        player2X: player2X.current,
        ballX: ballX.current,
        ballY: ballY.current,
        difficulty,
        obstacle,
      })
    },
    [canvasSize.width, canvasSize.height, paddleWidth, difficulty, obstacle]
  )

  useGameLoop({
    canvasRef,
    isRunningRef,
    drawScene,
    updatePositions,
    handleKeyDown: () => {},
    handleKeyUp: () => {},
  })

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

  const startGameFromModal = () => {
    initializeGame(gameMode)
  }

  // const startGameFromModal = () => {
  //   playGameStart()
  //   score1.current = 0
  //   score2.current = 0
  //   setGameOver(false)
  //   setShowModal(false)
  //   setScore1State(0)
  //   setScore2State(0)
  //   resetBall()
  //   setTimeout(() => {
  //     toggleRunning()
  //   }, 100)
  // }

  // AI logic
  useAIPlayerVertical({
    isRunningRef,
    AIdifficulty,
    playerXRef: rightPaddleYRef,
    paddleWidth: rightPaddleHeight,
    ballX,
    ballY,
    ballSpeedX,
    ballSpeedY,
    setLeftPressed: (val) => {
      aiUpPressedRef.current = val
    },
    setRightPressed: (val) => {
      aiDownPressedRef.current = val
    },
    enabled: opponentType === 'ai',
  })

  const onNextRound = () => {
    setShowRoundResultModal(false)
    // onResetBall(true)
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

  const isMobile = window.innerWidth < 950

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-black">
      <div className="flex flex-col items-center gap-6">
        <PlayersDisplay
          scoreLeft={score1State}
          scoreRight={score2State}
          opponentType={opponentType}
          showPlayer="right"
          isMobile={isMobile}
          playerLeftId={currentPlayerB ?? undefined}
          playerRightId={currentPlayerA ?? undefined}
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
            showLabels={false}
          />
        </PlayersDisplay>

        <GameSettingsModal
          buttonText={gameOver ? 'Play Again' : 'Start the game'}
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

        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="border-8 border-white rounded-md"
        />
        <PlayersDisplay
          scoreLeft={score1State}
          scoreRight={score2State}
          opponentType={opponentType}
          showPlayer="left"
          isMobile={isMobile}
          playerLeftId={currentPlayerB ?? undefined}
          playerRightId={currentPlayerA ?? undefined}
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
            showLabels={false}
          />
        </PlayersDisplay>
      </div>

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
            }}
            playerAliases={playerAliases}
            tournamentWinner={tournamentWinner}
            finalStandings={finalStandings}
          />
        ) : (
          <RoundResultModal
            winner={roundWinner}
            winnerAlias="winnerAlias"
            onNextRound={onNextRound}
            roundLabel={getRoundLabel(tournament.currentMatchIndex)}
          />
        ))}
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

export default VerticalPongGame
