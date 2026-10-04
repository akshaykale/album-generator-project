export const STEPS = ['cover', 'trip', 'photos', 'album', 'preview', 'order'] as const
export type Step = (typeof STEPS)[number]

export const STEP_LABELS: Record<Step, string> = {
  cover: 'Cover',
  trip: 'Your trip',
  photos: 'Your photos',
  album: 'Your album',
  preview: 'Preview',
  order: 'Order',
}

export type Density = 'spacious' | 'balanced' | 'compact'
export type Binding = 'softcover' | 'hardcover'

export type LocalPhoto = {
  id: string
  file: File
  name: string
  bytes: number
  type: string
  /** Object URL of a small preview, or null while pending / when the browser cannot decode the format. */
  thumbUrl: string | null
  thumbStatus: 'pending' | 'ready' | 'unsupported' | 'failed'
  width?: number
  height?: number
  sequence: number
}

export type Trip = {
  title: string
  startDate: string
  endDate: string
  country: string
  region: string
  places: string[]
  notes: string
}

export type AlbumOptions = {
  density: Density
  binding: Binding
  styleNote: string
  coverPhotoId: string | null
}

export type AlbumState = {
  step: Step
  /** Furthest step the user has legitimately reached; guards URL jumps. */
  reached: Step
  direction: 1 | -1
  trip: Trip
  photos: LocalPhoto[]
  options: AlbumOptions
  reduceMotion: boolean | null
}

export const initialState: AlbumState = {
  step: 'cover',
  reached: 'cover',
  direction: 1,
  trip: { title: '', startDate: '', endDate: '', country: '', region: '', places: [], notes: '' },
  photos: [],
  options: { density: 'balanced', binding: 'softcover', styleNote: '', coverPhotoId: null },
  reduceMotion: null,
}

export type Action =
  | { type: 'go'; to: Step }
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'trip'; patch: Partial<Trip> }
  | { type: 'photos/add'; photos: LocalPhoto[] }
  | { type: 'photos/update'; id: string; patch: Partial<LocalPhoto> }
  | { type: 'photos/remove'; id: string }
  | { type: 'options'; patch: Partial<AlbumOptions> }
  | { type: 'motion'; reduce: boolean | null }

export function stepIndex(step: Step): number {
  return STEPS.indexOf(step)
}

export function canProceed(state: AlbumState, from: Step = state.step): boolean {
  switch (from) {
    case 'cover':
      return true
    case 'trip':
      return state.trip.title.trim().length > 0
    case 'photos':
      return state.photos.length > 0
    case 'album':
      return state.options.coverPhotoId !== null
    case 'preview':
      return true
    case 'order':
      return false
  }
}

export function missingFor(state: AlbumState, from: Step = state.step): string | null {
  switch (from) {
    case 'trip':
      return state.trip.title.trim() ? null : 'Give your album a title to continue.'
    case 'photos':
      return state.photos.length ? null : 'Add at least one photo to continue.'
    case 'album':
      return state.options.coverPhotoId ? null : 'Choose a cover photo to continue.'
    default:
      return null
  }
}

function furthest(a: Step, b: Step): Step {
  return stepIndex(a) >= stepIndex(b) ? a : b
}

export function reducer(state: AlbumState, action: Action): AlbumState {
  switch (action.type) {
    case 'go': {
      const target = action.to
      // Allow going anywhere already reached, or exactly one step past the reached step when gating passes.
      const allowedMax = canProceed(state, state.reached)
        ? STEPS[Math.min(stepIndex(state.reached) + 1, STEPS.length - 1)]
        : state.reached
      const clamped = stepIndex(target) > stepIndex(allowedMax) ? allowedMax : target
      if (clamped === state.step) return state
      return {
        ...state,
        step: clamped,
        reached: furthest(state.reached, clamped),
        direction: stepIndex(clamped) > stepIndex(state.step) ? 1 : -1,
      }
    }
    case 'next': {
      if (!canProceed(state)) return state
      const i = stepIndex(state.step)
      if (i >= STEPS.length - 1) return state
      const to = STEPS[i + 1]
      return { ...state, step: to, reached: furthest(state.reached, to), direction: 1 }
    }
    case 'back': {
      const i = stepIndex(state.step)
      if (i <= 0) return state
      return { ...state, step: STEPS[i - 1], direction: -1 }
    }
    case 'trip':
      return { ...state, trip: { ...state.trip, ...action.patch } }
    case 'photos/add': {
      const existing = new Set(state.photos.map((p) => `${p.name}:${p.bytes}`))
      const fresh = action.photos.filter((p) => !existing.has(`${p.name}:${p.bytes}`))
      const photos = [...state.photos, ...fresh]
      const coverPhotoId = state.options.coverPhotoId ?? photos[0]?.id ?? null
      return { ...state, photos, options: { ...state.options, coverPhotoId } }
    }
    case 'photos/update':
      return {
        ...state,
        photos: state.photos.map((p) => (p.id === action.id ? { ...p, ...action.patch } : p)),
      }
    case 'photos/remove': {
      const removed = state.photos.find((p) => p.id === action.id)
      if (removed?.thumbUrl) URL.revokeObjectURL(removed.thumbUrl)
      const photos = state.photos.filter((p) => p.id !== action.id)
      const coverPhotoId =
        state.options.coverPhotoId === action.id ? (photos[0]?.id ?? null) : state.options.coverPhotoId
      return { ...state, photos, options: { ...state.options, coverPhotoId } }
    }
    case 'options':
      return { ...state, options: { ...state.options, ...action.patch } }
    case 'motion':
      return { ...state, reduceMotion: action.reduce }
  }
}
