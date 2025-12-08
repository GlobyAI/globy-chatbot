import { describe, it, expect } from 'vitest'
import { formatName, generateMessageId } from './helper'
import type { User } from '@auth0/auth0-react'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

describe('helper utils', () => {
  describe('formatName', () => {
    it('returns "Unknown" when user is undefined', () => {
      expect(formatName(undefined)).toBe('Unknown')
    })

    it('returns full name when both given_name and family_name exist', () => {
      const user: User = {
        given_name: 'John',
        family_name: 'Doe',
        nickname: 'johndoe',
        name: 'John Doe',
        picture: 'https://example.com/avatar.jpg',
        updated_at: '2024-01-01',
        sub: 'auth0|123'
      }
      
      expect(formatName(user)).toBe('John  Doe')
    })

    it('returns nickname when given_name is missing', () => {
      const user: User = {
        family_name: 'Doe',
        nickname: 'johndoe',
        name: 'John Doe',
        picture: 'https://example.com/avatar.jpg',
        updated_at: '2024-01-01',
        sub: 'auth0|123'
      }
      
      expect(formatName(user)).toBe('johndoe')
    })

    it('returns nickname when family_name is missing', () => {
      const user: User = {
        given_name: 'John',
        nickname: 'johndoe',
        name: 'John Doe',
        picture: 'https://example.com/avatar.jpg',
        updated_at: '2024-01-01',
        sub: 'auth0|123'
      }
      
      expect(formatName(user)).toBe('johndoe')
    })

    it('returns nickname when both names are missing', () => {
      const user: User = {
        nickname: 'johndoe',
        name: 'John Doe',
        picture: 'https://example.com/avatar.jpg',
        updated_at: '2024-01-01',
        sub: 'auth0|123'
      }
      
      expect(formatName(user)).toBe('johndoe')
    })

    it('handles user with empty strings for names', () => {
      const user: User = {
        given_name: '',
        family_name: '',
        nickname: 'johndoe',
        name: 'John Doe',
        picture: 'https://example.com/avatar.jpg',
        updated_at: '2024-01-01',
        sub: 'auth0|123'
      }
      
      expect(formatName(user)).toBe('johndoe')
    })
  })

  describe('generateMessageId', () => {
    it('generates an ID with "gid-" prefix', () => {
      const id = generateMessageId()
      expect(id).toMatch(/^gid-\d+$/)
    })

    it('generates unique IDs', async() => {
      const id1 = generateMessageId()
      await delay(2)
      const id2 = generateMessageId()
      
      expect(id1).not.toBe(id2)
    })

    it('generates ID with current timestamp', () => {
      const beforeTime = new Date().getTime()
      const id = generateMessageId()
      const afterTime = new Date().getTime()
      
      const timestamp = parseInt(id.replace('gid-', ''))
      
      expect(timestamp).toBeGreaterThanOrEqual(beforeTime)
      expect(timestamp).toBeLessThanOrEqual(afterTime)
    })

    it('ID format is correct', () => {
      const id = generateMessageId()
      
      expect(id.startsWith('gid-')).toBe(true)
      expect(id.length).toBeGreaterThan(4)
      expect(Number.isNaN(parseInt(id.replace('gid-', '')))).toBe(false)
    })
  })
})