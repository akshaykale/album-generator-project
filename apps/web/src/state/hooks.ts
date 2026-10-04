import { useContext, type Dispatch } from 'react'
import type { Action, AlbumState } from './album'
import { DispatchCtx, StateCtx } from './contexts'

export function useAlbum(): AlbumState {
  const s = useContext(StateCtx)
  if (!s) throw new Error('useAlbum outside AlbumProvider')
  return s
}

export function useAlbumDispatch(): Dispatch<Action> {
  const d = useContext(DispatchCtx)
  if (!d) throw new Error('useAlbumDispatch outside AlbumProvider')
  return d
}
