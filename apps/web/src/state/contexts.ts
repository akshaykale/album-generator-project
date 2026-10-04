import { createContext, type Dispatch } from 'react'
import type { Action, AlbumState } from './album'

export const StateCtx = createContext<AlbumState | null>(null)
export const DispatchCtx = createContext<Dispatch<Action> | null>(null)
