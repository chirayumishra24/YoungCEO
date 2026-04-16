// Re-export XP utilities from a canonical path so all pages can import from '../context/XPContext'
import { useContext } from 'react'
export { useXP } from '../components/XPCounter'
import { XPContext } from '../components/Layout'
export { XPContext }

/** Convenience hook that reads XP from the Layout-provided context */
export function useXPContext() {
  return useContext(XPContext)
}
