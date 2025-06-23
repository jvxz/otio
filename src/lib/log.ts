import c from 'chalk'
import { optionsStore } from './store/opts'

export const log = {
  break: () => {
    console.log('')
  },
  debug: (msg: string) => {
    const opts = optionsStore.getState()
    if (!opts.verbose) return

    console.log(c.white.dim(`${c.bold('[otio]')} ${msg}`))
  },
  error: (msg: string, prefix: string = ' error ') => {
    console.log(c.red.inverse.bold(prefix), c.red(msg))
  },
  info: (msg: string) => {
    console.log(c.gray(msg))
  },
}
