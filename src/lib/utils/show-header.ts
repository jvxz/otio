import c from 'chalk'
import { Effect } from 'effect'
import { name, version } from '../../../package.json'
import { log } from '../log'
import { optionsStore } from '../store/opts'

export const showHeader = Effect.gen(function* () {
  const opts = optionsStore.getState()

  if (opts.header) {
    log.info(`${c.white.inverse(` ${name} v${version} `)} ${opts.timeout}s`)
  }

  return yield* Effect.void
})
