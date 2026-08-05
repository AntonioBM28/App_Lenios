import { describe, it, expect } from 'vitest'
import { formatCurrency, truncate, clamp } from './index'

describe('formatCurrency', () => {
  it('formats an integer amount as Mexican pesos without decimals', () => {
    expect(formatCurrency(185)).toBe('$185')
  })

  it('rounds/omits decimals (maximumFractionDigits: 0)', () => {
    expect(formatCurrency(99.9)).toBe('$100')
  })

  it('formats 0 correctly', () => {
    expect(formatCurrency(0)).toBe('$0')
  })
})

describe('truncate', () => {
  it('returns the text unchanged if shorter than maxLength', () => {
    expect(truncate('Leños', 10)).toBe('Leños')
  })

  it('truncates and appends an ellipsis if longer than maxLength', () => {
    expect(truncate('Leño Relleno de Queso', 10)).toBe('Leño Relle…')
  })

  it('trims trailing whitespace before appending the ellipsis', () => {
    expect(truncate('Leño Rell eno', 10)).toBe('Leño Rell…')
  })
})

describe('clamp', () => {
  it('returns the value unchanged when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })

  it('clamps to min when below range', () => {
    expect(clamp(-3, 0, 10)).toBe(0)
  })

  it('clamps to max when above range', () => {
    expect(clamp(99, 0, 10)).toBe(10)
  })
})
