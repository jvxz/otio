import { createStore } from 'zustand/vanilla'
import type { ProgramOptions } from '../../cli'

interface State extends ProgramOptions {
  cmds: string[]
}

type Actions = {
  setOpts: (opts: State) => void
}

const initialState: State = {
  cmds: [],
  dir: '.',
  header: false,
  timeout: '10s',
  verbose: false,
}

const optionsStore = createStore<State & Actions>(set => ({
  ...initialState,
  setOpts: opts => set(opts),
}))

export { optionsStore }
