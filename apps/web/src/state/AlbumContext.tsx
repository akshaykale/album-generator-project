import { useEffect, useReducer, type ReactNode } from 'react'
import { STEPS, initialState, reducer, type Step } from './album'
import { DispatchCtx, StateCtx } from './contexts'

function stepFromHash(): Step | null {
  const h = window.location.hash.replace('#', '')
  return (STEPS as readonly string[]).includes(h) ? (h as Step) : null
}

export function AlbumProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Mirror the step into the URL hash so refresh and back button keep the place.
  useEffect(() => {
    if (stepFromHash() !== state.step) {
      window.history.replaceState(null, '', `#${state.step}`)
    }
  }, [state.step])

  useEffect(() => {
    const onHash = () => {
      const target = stepFromHash()
      if (target) dispatch({ type: 'go', to: target })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return (
    <StateCtx.Provider value={state}>
      <DispatchCtx.Provider value={dispatch}>{children}</DispatchCtx.Provider>
    </StateCtx.Provider>
  )
}
