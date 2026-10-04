import type { ReactNode } from 'react'
import { STEPS, STEP_LABELS, canProceed, missingFor, stepIndex } from '../state/album'
import { useAlbum, useAlbumDispatch } from '../state/hooks'
import { DogEar } from './DogEar'

type Props = {
  /** Heading of the page. Receives focus after a turn. */
  title: string
  eyebrow?: string
  children: ReactNode
  /** Hide standard navigation (used on the cover). */
  bare?: boolean
  nextLabel?: string
  spread: boolean
}

/**
 * Standard page: eyebrow, heading, scrollable body, footer navigation, dog-ear.
 * Everything here is flat and interactive. The turn happens in a separate layer.
 */
export function PageChrome({ title, eyebrow, children, bare, nextLabel, spread }: Props) {
  const state = useAlbum()
  const dispatch = useAlbumDispatch()
  const idx = stepIndex(state.step)
  const isLast = idx === STEPS.length - 1
  const allowed = canProceed(state)
  const missing = missingFor(state)

  return (
    <div className="relative flex h-full flex-col">
      {!spread && !bare && (
        <div className="px-6 pt-5 text-xs text-ink-faint">
          <span className="font-display tracking-wide">
            Page {idx + 1} of {STEPS.length}
          </span>
          <span className="mx-2">·</span>
          <span>{STEP_LABELS[state.step]}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-6 pt-6 sm:px-10 sm:pt-8">
        {eyebrow && <p className="font-display text-xs uppercase tracking-[0.25em] text-ink-faint">{eyebrow}</p>}
        <h1 data-page-heading tabIndex={-1} className="mt-2 text-3xl leading-tight text-ink sm:text-4xl">
          {title}
        </h1>
        <div className="mt-6">{children}</div>
      </div>

      {!bare && (
        <footer className="flex items-center justify-between gap-4 border-t border-ink/10 px-6 py-4 pr-20 sm:px-10">
          <button
            type="button"
            onClick={() => dispatch({ type: 'back' })}
            disabled={idx === 0}
            className="rounded-full px-3 py-2 text-sm text-ink-soft hover:bg-ink/5 disabled:opacity-40"
          >
            ← Back
          </button>
          <div className="min-w-0 flex-1 text-center text-xs text-ink-faint" aria-live="polite">
            {!allowed && missing ? missing : ''}
          </div>
          {!isLast && (
            <button
              type="button"
              onClick={() => dispatch({ type: 'next' })}
              disabled={!allowed}
              className="rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-paper shadow-lift transition hover:bg-terracotta-deep disabled:cursor-not-allowed disabled:opacity-40"
            >
              {nextLabel ?? 'Next page'} →
            </button>
          )}
        </footer>
      )}

      {!isLast && (
        <DogEar
          onActivate={() => dispatch({ type: 'next' })}
          disabled={!allowed}
          label={allowed ? 'Turn to the next page' : 'Complete this page to turn'}
        />
      )}
    </div>
  )
}
