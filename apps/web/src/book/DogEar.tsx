import { motion } from 'motion/react'

type Props = {
  onActivate: () => void
  disabled: boolean
  label: string
}

/**
 * Folded page corner in the bottom outer corner of the active page.
 * A playful secondary "next" control; the conventional button remains the primary.
 */
export function DogEar({ onActivate, disabled, label }: Props) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onActivate}
      className="group absolute right-0 bottom-0 h-16 w-16 cursor-pointer disabled:cursor-not-allowed"
      whileHover={disabled ? undefined : { scale: 1.08 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 24 }}
    >
      {/* Shadow under the lifted corner */}
      <span
        aria-hidden
        className="absolute inset-0 bg-ink/15 blur-[3px]"
        style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)', transform: 'translate(-2px, 2px)' }}
      />
      {/* Page underneath, showing through where the corner lifted */}
      <span
        aria-hidden
        className="absolute inset-0 bg-paper-shade"
        style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}
      />
      {/* The folded-over corner */}
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-white/90 via-paper to-paper-deep transition-colors group-disabled:opacity-50 group-hover:from-white"
        style={{ clipPath: 'polygon(0 100%, 100% 0, 0 0)' }}
      />
      <span
        aria-hidden
        className="absolute left-3 top-2 font-display text-[11px] tracking-wide text-ink-soft opacity-0 transition-opacity group-hover:opacity-100 group-disabled:opacity-0"
        style={{ transform: 'rotate(-45deg)', transformOrigin: 'left top' }}
      >
        turn
      </span>
    </motion.button>
  )
}
