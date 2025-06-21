import c from 'chalk'
import { Cause, Effect, Exit, Option } from 'effect'
import { name, version } from '../package.json'
import { cli, type ProgramOptions } from './cli'
import { log } from './lib/log'
import { runCmd } from './lib/utils/run-cmd'

function program(cmds: string[], options: ProgramOptions) {
  return Effect.gen(function* () {
    if (cmds.length === 0) {
      log.error('no commands provided')
      log.break()

      cli.help()
    }

    if (options.header) {
      log.info(c.white.inverse(` ${name} v${version} `))

      const cmdsList = cmds.map(cmd => `${c.white.bold.dim(cmd)}`).join(', ')
      log.info(`> ${cmdsList}`)

      log.break()
    }

    if (options.timeout) {
      log.info(`with timeout: ${c.white.dim(options.timeout)}`)
    }

    yield* Effect.forEach(cmds, runCmd, {
      concurrency: 'unbounded',
    })
  })
}

export async function handleAction(cmds: string[], options: ProgramOptions) {
  const exit = await program(cmds, options).pipe(Effect.runPromiseExit)

  Exit.match(exit, {
    onFailure: error => {
      const cause = Cause.failureOption(error)

      if (Option.isSome(cause)) {
        log.error(cause.value.message)
      }

      process.exit(1)
    },
    onSuccess: () => {},
  })
}
