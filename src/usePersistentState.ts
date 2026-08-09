import { useEffect, useState } from 'react'

/** useState that mirrors into localStorage, so a reload keeps the career in progress. */
export function usePersistentState<T>(key: string, fallback: T, revive: (raw: unknown) => T | null): [T, (next: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    if (stored === null) return fallback
    return revive(JSON.parse(stored)) ?? fallback
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value instanceof Set ? [...value] : value))
  }, [key, value])

  return [value, setValue]
}
