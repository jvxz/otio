import c from 'chalk'
import { Cause, Effect, Exit, Option } from 'effect'
import { name, version } from '../package.json'
import { cli, type ProgramOptions } from './cli'
import { log } from './lib/log'
import { optionsStore } from './lib/store/opts'
import { runCmd } from './lib/utils/run-cmd'
import { handleTimeout } from './lib/utils/timeout'

const program = Effect.gen(function* () {
  const opts = optionsStore.getState()

  if (opts.cmds.length === 0) {
    log.error('no commands provided')
    log.break()

    cli.help()
  }

  if (opts.header) {
    log.info(c.white.inverse(` ${name} v${version} `))

    const cmdsList = opts.cmds.map(cmd => `${c.white.bold.dim(cmd)}`).join(', ')
    log.info(`> ${cmdsList}`)

    log.break()
  }

  if (opts.timeout) {
    log.info(`with timeout: ${c.white.dim(opts.timeout)}`)
  }

  // run timeout handler in the background
  yield* Effect.fork(
    handleTimeout({
      dir: opts.dir,
      timeout: Number(opts.timeout),
    }),
  )

  // run all commands in parallel
  yield* Effect.forEach(opts.cmds, cmd => runCmd(cmd), {
    concurrency: 'unbounded',
  })
})

export async function handleAction(cmds: string[], options: ProgramOptions) {
  // initialize options store
  optionsStore.setState({
    ...options,
    cmds,
  })

  const exit = await program.pipe(Effect.runPromiseExit)

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
