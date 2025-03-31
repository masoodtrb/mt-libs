import { useState } from 'react'

export function useExample() {
  const [state, setState] = useState(null)
  return [state, setState] as const
}
