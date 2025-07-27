import fs from 'node:fs'
import { Data, Effect } from 'effect'
import type { ProgramOptions } from '../../cli'
import { optionsStore } from '../store/opts'

class OptionsError extends Data.TaggedError('OptionsError')<{
  cause?: unknown
  message?: string
}> {}

export function handleOptions(cmds: string[], options: ProgramOptions) {
  return Effect.gen(function* () {
    const dirExists = fs.existsSync(options.dir)

    if (!dirExists) {
      return yield* Effect.fail(
        new OptionsError({
          message: `directory does not exist: ${options.dir}`,
        }),
      )
    }

    if (Number.isNaN(Number(options.timeout))) {
      return yield* Effect.fail(
        new OptionsError({
          message: `timeout must be a number: ${options.timeout}`,
        }),
      )
    }

    optionsStore.setState({
      ...options,
      cmds,
    })
  })
}
