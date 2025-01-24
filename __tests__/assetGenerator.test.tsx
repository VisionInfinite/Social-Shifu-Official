// __tests__/assetGenerator.test.tsx
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { AssetGenerator } from '@/components/AssetGenerator'
import { Script } from '@/lib/types'

describe('AssetGenerator', () => {
  const mockScript: Script = {
    _id: '123',
    userId: 'user123',
    topic: 'Test Script',
    keywords: ['test', 'mock'],
    description: 'Test description',
    tone: 'casual',
    duration: '1min',
    content: 'Test content',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  it('renders generate button', () => {
    render(<AssetGenerator script={mockScript} />)
    expect(screen.getByText('Generate Assets')).toBeInTheDocument()
  })

  it('shows loading state when generating', async () => {
    render(<AssetGenerator script={mockScript} />)
    fireEvent.click(screen.getByText('Generate Assets'))
    expect(screen.getByText('Generating...')).toBeInTheDocument()
  })
})
