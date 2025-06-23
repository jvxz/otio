import c from 'chalk'
import { Cause, Effect, Exit, Option } from 'effect'
import type { ProgramOptions } from './cli'
import { log } from './lib/log'
import { optionsStore } from './lib/store/opts'
import { handleEmpty } from './lib/utils/handle-empty'
import { runCmd } from './lib/utils/run-cmd'
import { showHeader } from './lib/utils/show-header'
import { handleTimeout } from './lib/utils/timeout'

const program = Effect.gen(function* () {
  const opts = optionsStore.getState()

  handleEmpty()
  yield* showHeader

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
