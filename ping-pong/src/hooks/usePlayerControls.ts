import { useCallback, useRef } from 'react'
export const usePlayerControls = () => {
  const upPressed = useRef(false)
  const downPressed = useRef(false)
  const wPressed = useRef(false)
  const sPressed = useRef(false)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case 'ArrowUp':
        upPressed.current = true
        break
      case 'ArrowDown':
        downPressed.current = true
        break
      case 'KeyW':
        wPressed.current = true
        break
      case 'KeyS':
        sPressed.current = true
        break
    }
  }, [])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case 'ArrowUp':
        upPressed.current = false
        break
      case 'ArrowDown':
        downPressed.current = false
        break
      case 'KeyW':
        wPressed.current = false
        break
      case 'KeyS':
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
