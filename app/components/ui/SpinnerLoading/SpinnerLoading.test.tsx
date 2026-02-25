import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SpinnerLoading from './SpinnerLoading'

describe('SpinnerLoading', () => {
  it('renders the loading container', () => {
    const { container } = render(<SpinnerLoading />)
    const loadingDiv = container.querySelector('.loading')
    
    expect(loadingDiv).toBeInTheDocument()
  })

  it('renders the loader element', () => {
    const { container } = render(<SpinnerLoading />)
    const loaderDiv = container.querySelector('.loader')
    
    expect(loaderDiv).toBeInTheDocument()
  })

  it('has correct structure with nested elements', () => {
    const { container } = render(<SpinnerLoading />)
    const loadingDiv = container.querySelector('.loading')
    const loaderDiv = loadingDiv?.querySelector('.loader')
    
    expect(loadingDiv).toBeInTheDocument()
    expect(loaderDiv).toBeInTheDocument()
  })

  it('renders without crashing', () => {
    expect(() => render(<SpinnerLoading />)).not.toThrow()
  })

  it('matches snapshot', () => {
    const { container } = render(<SpinnerLoading />)
    expect(container.firstChild).toMatchSnapshot()
  })
})