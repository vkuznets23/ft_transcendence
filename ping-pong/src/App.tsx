import { useEffect, useState } from 'react'
import './App.css'
import PongGame from './components/game'
import VerticalPongGame from './components/verticalGame'

function App() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)

  useEffect(() => {
    const updateScreen = () => {
      setIsDesktop(window.innerWidth >= 950)
    }

    updateScreen()
    window.addEventListener('resize', updateScreen)
    return () => window.removeEventListener('resize', updateScreen)
  }, [])

  if (isDesktop === null) return null

  return <div>{isDesktop ? <PongGame /> : <VerticalPongGame />}</div>
}

export default App
