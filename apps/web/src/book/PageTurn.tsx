import { motion } from 'motion/react'
import type { ReactNode } from 'react'

export type Turn = {
  key: number
  direction: 1 | -1
}

type Props = {
  turn: Turn
  /** Visual on the side of the sheet that faces the reader when the sheet lies on the right. */
  front: ReactNode
  /** Visual on the reverse side, seen when the sheet lies on the left (spread only). */
  back: ReactNode
  spread: boolean
  onComplete: () => void
}

/**
 * A non-interactive sheet that rotates around the spine while the real, flat page sits underneath.
 * Forward: starts flat on the right (0deg) and turns over onto the left (-180deg).
 * Back: starts on the left (-180deg) and turns back onto the right (0deg).
 * On single-page layouts the sheet turns off the edge instead (about -105deg) and fades.
 */
export function PageTurn({ turn, front, back, spread, onComplete }: Props) {
  const forward = turn.direction === 1
  const fullAngle = spread ? -180 : -105
  const duration = spread ? 0.55 : 0.45
  const from = forward ? 0 : fullAngle
  const to = forward ? fullAngle : 0

  return (
    <motion.div
      key={turn.key}
      aria-hidden
      // @ts-expect-error inert is a valid boolean DOM attribute in React 19
      inert=""
      className="pointer-events-none absolute inset-0 z-20 preserve-3d"
      style={{ transformOrigin: 'left center', willChange: 'transform' }}
      initial={{ rotateY: from, opacity: 1 }}
      animate={{
        rotateY: to,
        opacity: spread ? 1 : forward ? [1, 1, 0.98, 0] : [0, 0.98, 1, 1],
      }}
      transition={{
        duration,
        ease: [0.45, 0.05, 0.25, 1],
        opacity: { duration, times: [0, 0.6, 0.8, 1] },
      }}
      onAnimationComplete={onComplete}
    >
      {/* Front face */}
      <div className="absolute inset-0 overflow-hidden rounded-r-[14px] paper-grain backface-hidden shadow-sheet">
        <div className="absolute inset-0">{front}</div>
        {/* Shading that deepens as the sheet lifts, read as a curl */}
        <motion.div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/0 via-ink/0 to-ink/25"
          initial={{ opacity: forward ? 0 : 1 }}
          animate={{ opacity: forward ? 1 : 0 }}
          transition={{ duration }}
        />
      </div>
      {/* Back face */}
      <div
        className="absolute inset-0 overflow-hidden rounded-l-[14px] paper-grain backface-hidden shadow-sheet"
        style={{ transform: 'rotateY(180deg)' }}
      >
        <div className="absolute inset-0">{back}</div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-ink/0 to-ink/15" />
      </div>
    </motion.div>
  )
}
