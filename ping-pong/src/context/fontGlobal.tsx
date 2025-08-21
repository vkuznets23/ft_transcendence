import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'

type TextSize = 'small' | 'medium' | 'large'

interface TextSizeContextType {
  textSize: TextSize
  setTextSize: (size: TextSize) => void
  textClass: string
  headingClass: string
}

const TextSizeContext = createContext<TextSizeContextType | undefined>(
  undefined
)

export const TextSizeProvider = ({ children }: { children: ReactNode }) => {
  const [textSize, setTextSize] = useState<TextSize>(
    (localStorage.getItem('textSize') as TextSize) || 'medium'
  )

  const textClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[textSize]

  const headingClass = {
    small: 'text-base',
    medium: 'text-2xl',
    large: 'text-4xl',
  }[textSize]

  const updateTextSize = (size: TextSize) => {
    setTextSize(size)
    localStorage.setItem('textSize', size)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + + => увеличить текст
      if (e.ctrlKey && (e.key === '=' || e.key === '+')) {
        e.preventDefault()
        updateTextSize(textSize === 'small' ? 'medium' : 'large')
      }

      // Ctrl + - => уменьшить текст
      if (e.ctrlKey && e.key === '-') {
        e.preventDefault()
        updateTextSize(textSize === 'large' ? 'medium' : 'small')
      }

      // Ctrl + 0 => сброс к среднему
      if (e.ctrlKey && e.key === '0') {
        e.preventDefault()
        updateTextSize('medium')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [textSize])

  return (
    <TextSizeContext.Provider
      value={{ textSize, setTextSize: updateTextSize, textClass, headingClass }}
    >
      {children}
    </TextSizeContext.Provider>
  )
}

export const useTextSize = () => {
  const context = useContext(TextSizeContext)
  if (!context)
    throw new Error('useTextSize must be used within a TextSizeProvider')
  return context
}
