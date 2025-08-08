import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import PauseModal from '../components/PauseModal'

describe('PauseModal', () => {
  const mockOnContinue = jest.fn()

  beforeEach(() => {
    mockOnContinue.mockReset()
  })

  it('renders the Continue button', () => {
    render(<PauseModal onContinue={mockOnContinue} />)

    const button = screen.getByRole('button', { name: /continue game/i })
    expect(button).toBeInTheDocument()
  })

  it('calls onContinue when the Continue button is clicked', () => {
    render(<PauseModal onContinue={mockOnContinue} />)

    const button = screen.getByRole('button', { name: /continue game/i })
    fireEvent.click(button)

    expect(mockOnContinue).toHaveBeenCalledTimes(1)
  })

  it('has correct accessibility label on button', () => {
    render(<PauseModal onContinue={mockOnContinue} />)

    const button = screen.getByLabelText(/continue game/i)
    expect(button).toBeInTheDocument()
  })
})
