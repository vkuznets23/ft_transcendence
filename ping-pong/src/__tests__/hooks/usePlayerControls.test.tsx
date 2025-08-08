import { renderHook, act } from '@testing-library/react'
import { usePlayerControls } from '../../hooks/usePlayerControls'

describe('usePlayerControls', () => {
  it('handleKeyDown sets correct ref to true', () => {
    const { result } = renderHook(() => usePlayerControls())

    act(() => {
      result.current.handleKeyDown({ code: 'ArrowUp' } as KeyboardEvent)
    })
    expect(result.current.upPressed.current).toBe(true)

    act(() => {
      result.current.handleKeyDown({ code: 'ArrowDown' } as KeyboardEvent)
    })
    expect(result.current.downPressed.current).toBe(true)

    act(() => {
      result.current.handleKeyDown({ code: 'KeyW' } as KeyboardEvent)
    })
    expect(result.current.wPressed.current).toBe(true)

    act(() => {
      result.current.handleKeyDown({ code: 'KeyS' } as KeyboardEvent)
    })
    expect(result.current.sPressed.current).toBe(true)
  })

  test('handleKeyUp sets correct ref to false', () => {
    const { result } = renderHook(() => usePlayerControls())

    act(() => {
      result.current.upPressed.current = true
      result.current.downPressed.current = true
      result.current.wPressed.current = true
      result.current.sPressed.current = true
    })

    act(() => {
      result.current.handleKeyUp({ code: 'ArrowUp' } as KeyboardEvent)
    })
    expect(result.current.upPressed.current).toBe(false)

    act(() => {
      result.current.handleKeyUp({ code: 'ArrowDown' } as KeyboardEvent)
    })
    expect(result.current.downPressed.current).toBe(false)

    act(() => {
      result.current.handleKeyUp({ code: 'KeyW' } as KeyboardEvent)
    })
    expect(result.current.wPressed.current).toBe(false)

    act(() => {
      result.current.handleKeyUp({ code: 'KeyS' } as KeyboardEvent)
    })
    expect(result.current.sPressed.current).toBe(false)
  })
})
