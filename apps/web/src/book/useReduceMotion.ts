import { useAlbum } from '../state/hooks'
import { useSystemReducedMotion } from '../hooks/useMediaQuery'

/** In-app toggle wins when set; otherwise follow the OS preference. */
export function useReduceMotion(): boolean {
  const system = useSystemReducedMotion()
  const { reduceMotion } = useAlbum()
  return reduceMotion ?? system
}
