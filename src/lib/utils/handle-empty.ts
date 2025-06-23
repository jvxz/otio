import { cli } from '../../cli'
import { log } from '../log'
import { optionsStore } from '../store/opts'

export function handleEmpty() {
  const opts = optionsStore.getState()

  if (opts.cmds.length === 0) {
    log.error('no commands provided')
    log.break()

    cli.help()
  }
}
