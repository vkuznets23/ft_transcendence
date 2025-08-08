import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../utils/constants'
import { generateRandomObstacle } from '../../utils/generateObstacle'
import { resetBall } from '../../utils/resetBall'

jest.mock('../../utils/generateObstacle')

describe('resetBall', () => {
  let ballXRef: { current: number }
  let ballYRef: { current: number }
  let ballSpeedXRef: { current: number }
  let ballSpeedYRef: { current: number }
  let setObstacle: jest.Mock

  beforeEach(() => {
    ballXRef = { current: 0 }
    ballYRef = { current: 0 }
    ballSpeedXRef = { current: 0 }
    ballSpeedYRef = { current: 0 }
    setObstacle = jest.fn()
    ;(generateRandomObstacle as jest.Mock).mockReturnValue({
      x: 100,
      y: 100,
      width: 50,
      height: 50,
    })
  })

  it('resets ball position to center', () => {
    resetBall(
      ballXRef,
      ballYRef,
      ballSpeedXRef,
      ballSpeedYRef,
      'easy',
      setObstacle,
      false
    )
    expect(ballXRef.current).toBe(CANVAS_WIDTH / 2)
    expect(ballYRef.current).toBe(CANVAS_HEIGHT / 2)
  })

  it('sets ball speeds with correct magnitude and sign', () => {
    const mathRandomMock = jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.7)
      .mockReturnValueOnce(0.3)

    resetBall(
      ballXRef,
      ballYRef,
      ballSpeedXRef,
      ballSpeedYRef,
      'easy',
      setObstacle,
      false
    )

    expect(Math.abs(ballSpeedXRef.current)).toBe(5)
    expect(Math.abs(ballSpeedYRef.current)).toBe(3)

    expect(ballSpeedXRef.current).toBeGreaterThan(0)
    expect(ballSpeedYRef.current).toBeLessThan(0)

    mathRandomMock.mockRestore()
  })

  it('calls setObstacle for medium difficulty', () => {
    resetBall(
      ballXRef,
      ballYRef,
      ballSpeedXRef,
      ballSpeedYRef,
      'medium',
      setObstacle,
      false
    )
    expect(setObstacle).toHaveBeenCalledTimes(1)
    expect(setObstacle).toHaveBeenCalledWith({
      x: 100,
      y: 100,
      width: 50,
      height: 50,
    })
  })

  it('calls setObstacle for hard difficulty', () => {
    resetBall(
      ballXRef,
      ballYRef,
      ballSpeedXRef,
      ballSpeedYRef,
      'hard',
      setObstacle,
      false
    )
    expect(setObstacle).toHaveBeenCalledTimes(1)
  })

  it('does not call setObstacle for easy difficulty', () => {
    resetBall(
      ballXRef,
      ballYRef,
      ballSpeedXRef,
      ballSpeedYRef,
      'easy',
      setObstacle,
      false
    )
    expect(setObstacle).not.toHaveBeenCalled()
  })
})
