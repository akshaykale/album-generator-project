import { STEPS, STEP_LABELS, stepIndex, type Step } from '../state/album'
import { useAlbum, useAlbumDispatch } from '../state/hooks'

const DENSITY_LABEL = { spacious: 'Spacious', balanced: 'Balanced', compact: 'Compact' } as const
const BINDING_LABEL = { softcover: 'Softcover', hardcover: 'Hardcover' } as const

function fmtDates(start: string, end: string): string {
  if (!start && !end) return ''
  const f = (s: string) => {
    if (!s) return ''
    const d = new Date(s + 'T00:00:00')
    return isNaN(d.getTime()) ? s : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
  }
  if (start && end) return `${f(start)} – ${f(end)}`
  return f(start || end)
}

/**
 * The left page of the spread: a table of contents that fills in as the user works.
 * It doubles as a review surface. Completed entries are links back to their step.
 */
export function Contents() {
  const state = useAlbum()
  const dispatch = useAlbumDispatch()
  const { trip, photos, options } = state
  const cover = photos.find((p) => p.id === options.coverPhotoId)

  const rows: { step: Step; label: string; value: string | null; hint: string }[] = [
    {
      step: 'trip',
      label: 'Trip',
      value: trip.title
        ? [trip.title, fmtDates(trip.startDate, trip.endDate), [trip.region, trip.country].filter(Boolean).join(', ')]
            .filter(Boolean)
            .join(' · ')
        : null,
      hint: 'Where you went and when',
    },
    {
      step: 'trip',
      label: 'Places',
      value: trip.places.length ? trip.places.join(', ') : null,
      hint: 'Cities and spots you visited',
    },
    {
      step: 'photos',
      label: 'Photos',
      value: photos.length ? `${photos.length} selected` : null,
      hint: 'The memories you want printed',
    },
    {
      step: 'album',
      label: 'Album',
      value:
        stepIndex(state.reached) >= stepIndex('album')
          ? `${DENSITY_LABEL[options.density]} · ${BINDING_LABEL[options.binding]}`
          : null,
      hint: 'Density and binding',
    },
    {
      step: 'album',
      label: 'Cover',
      value: cover && stepIndex(state.reached) >= stepIndex('album') ? cover.name : null,
      hint: 'The photo on the front',
    },
  ]

  return (
    <div className="flex h-full flex-col px-8 py-10 sm:px-12">
      <p className="font-display text-xs uppercase tracking-[0.25em] text-ink-faint">Contents</p>
      <h2 className="mt-3 text-3xl leading-tight text-ink">
        {trip.title.trim() || <span className="text-ink-faint">Your album</span>}
      </h2>

      <ol className="mt-10 flex flex-col gap-5">
        {rows.map((row, i) => {
          const reachable = stepIndex(row.step) <= stepIndex(state.reached)
          return (
            <li key={row.label + i} className="grid grid-cols-[1.5rem_1fr] gap-3">
              <span className="font-display text-sm text-ink-faint tabular-nums">{i + 1}</span>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-base text-ink">{row.label}</span>
                  <span aria-hidden className="flex-1 border-b border-dotted border-ink/25 translate-y-[-3px]" />
                  {row.value && reachable ? (
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'go', to: row.step })}
                      className="text-xs text-terracotta hover:underline"
                    >
                      edit
                    </button>
                  ) : null}
                </div>
                <p className={`mt-1 truncate text-sm ${row.value ? 'text-ink-soft' : 'text-ink-faint italic'}`}>
                  {row.value ?? row.hint}
                </p>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="mt-auto pt-8">
        <ol className="flex items-center gap-2" aria-label="Progress">
          {STEPS.map((s) => {
            const current = s === state.step
            const done = stepIndex(s) < stepIndex(state.step)
            return (
              <li key={s} className="flex items-center gap-2">
                <span
                  aria-current={current ? 'step' : undefined}
                  title={STEP_LABELS[s]}
                  className={`block h-2 w-2 rounded-full transition-colors ${
                    current ? 'bg-terracotta scale-125' : done ? 'bg-sage' : 'bg-ink/20'
                  }`}
                />
              </li>
            )
          })}
          <li className="ml-2 text-xs text-ink-faint">
            {stepIndex(state.step) + 1} / {STEPS.length}
          </li>
        </ol>
      </div>
    </div>
  )
}
