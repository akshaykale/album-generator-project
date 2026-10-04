import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useIsSpread } from '../hooks/useMediaQuery'
import type { Step } from '../state/album'
import { useAlbum, useAlbumDispatch } from '../state/hooks'
import { Contents } from './Contents'
import { PageTurn, type Turn } from './PageTurn'
import { useReduceMotion } from './useReduceMotion'

type Props = {
  renderStep: (step: Step, spread: boolean) => ReactNode
}

type ActiveTurn = Turn & { from: Step; to: Step }

/**
 * The book frame. Owns the layout (spread vs single page), the page-turn transition,
 * keyboard navigation and focus management. Step content is rendered flat and interactive;
 * the turning sheet is a separate inert layer.
 */
export function Book({ renderStep }: Props) {
  const state = useAlbum()
  const dispatch = useAlbumDispatch()
  const spread = useIsSpread()
  const reduce = useReduceMotion()

  const [turn, setTurn] = useState<ActiveTurn | null>(null)
  const prevStep = useRef<Step>(state.step)
  const turnKey = useRef(0)
  const rightPageRef = useRef<HTMLDivElement>(null)

  const focusHeading = useCallback(() => {
    const h = rightPageRef.current?.querySelector<HTMLElement>('[data-page-heading]')
    h?.focus({ preventScroll: true })
  }, [])

  // Detect step changes and start a turn.
  useEffect(() => {
    if (prevStep.current === state.step) return
    const from = prevStep.current
    prevStep.current = state.step
    if (reduce) {
      // Crossfade is handled by AnimatePresence; just move focus shortly after.
      const t = window.setTimeout(focusHeading, 200)
      return () => window.clearTimeout(t)
    }
    turnKey.current += 1
    setTurn({ key: turnKey.current, direction: state.direction, from, to: state.step })
  }, [state.step, state.direction, reduce, focusHeading])

  const onTurnComplete = useCallback(() => {
    setTurn(null)
    focusHeading()
  }, [focusHeading])

  // Arrow keys when focus is not in a text field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      const tag = t?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t?.isContentEditable) return
      if (e.key === 'ArrowRight') dispatch({ type: 'next' })
      if (e.key === 'ArrowLeft') dispatch({ type: 'back' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dispatch])

  // While turning back, the flat page keeps showing the outgoing step until the sheet lands.
  const flatStep: Step = turn && turn.direction === -1 ? turn.from : state.step
  const turning = turn !== null

  return (
    <div className="flex h-full items-center justify-center p-3 sm:p-6">
      <div
        className={`relative flex h-[min(100dvh-1.5rem,900px)] w-full ${
          spread ? 'max-w-[1400px]' : 'max-w-[520px]'
        }`}
        style={{ perspective: spread ? '2600px' : '1400px' }}
      >
        {spread && (
          <div className="relative flex-1 overflow-hidden rounded-l-[14px] paper-grain page-edge-left">
            <Contents />
          </div>
        )}

        {/* Spine */}
        {spread && (
          <div
            aria-hidden
            className="relative z-10 w-[18px] shrink-0"
            style={{
              background:
                'linear-gradient(90deg, rgb(42 37 31 / 0.28), rgb(42 37 31 / 0.08) 35%, rgb(42 37 31 / 0.08) 65%, rgb(42 37 31 / 0.28))',
            }}
          />
        )}

        <div
          ref={rightPageRef}
          className={`relative flex-1 overflow-hidden paper-grain ${
            spread ? 'rounded-r-[14px] page-edge-right' : 'rounded-[14px] shadow-page'
          }`}
        >
          {/* Flat, interactive page */}
          {reduce ? (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={state.step}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {renderStep(state.step, spread)}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div
              className="absolute inset-0"
              // @ts-expect-error inert is a valid boolean DOM attribute in React 19
              inert={turning ? '' : undefined}
            >
              {renderStep(flatStep, spread)}
            </div>
          )}

          {/* Turning sheet */}
          {turn && (
            <PageTurn
              turn={turn}
              spread={spread}
              onComplete={onTurnComplete}
              front={renderStep(turn.direction === 1 ? turn.from : turn.to, spread)}
              back={spread ? <Contents /> : null}
            />
          )}
        </div>
      </div>
    </div>
  )
}
