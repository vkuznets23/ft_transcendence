import { useCallback, useRef } from 'react'

export const usePlayerControls = () => {
  const upPressed = useRef(false)
  const downPressed = useRef(false)
  const wPressed = useRef(false)
  const sPressed = useRef(false)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key.toLowerCase()) {
      case 'arrowup':
        upPressed.current = true
        break
      case 'arrowdown':
        downPressed.current = true
        break
      case 'w':
        wPressed.current = true
        break
      case 's':
        sPressed.current = true
        break
    }
  }, [])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    switch (e.key.toLowerCase()) {
      case 'arrowup':
        upPressed.current = false
        break
      case 'arrowdown':
        downPressed.current = false
        break
      case 'w':
        wPressed.current = false
        break
      case 's':
        sPressed.current = false
        break
    }
  }, [])

  return {
    upPressed,
    downPressed,
    wPressed,
    sPressed,
    handleKeyDown,
    handleKeyUp,
  }
}
