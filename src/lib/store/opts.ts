import { createStore } from 'zustand'
import type { ProgramOptions } from '../../cli'

interface State extends ProgramOptions {
  commands: string[]
}

const initialState: State = {
  commands: [],
  dir: '.',
  header: false,
  timeout: '10s',
  verbose: false,
}

const optionsStore = createStore<State>(() => initialState)

export { optionsStore }
export type { State as OptionsState }
