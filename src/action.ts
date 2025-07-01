import { Effect } from 'effect'
import type { ProgramOptions } from './cli'
import { optionsStore } from './lib/store/opts'
import { handleConfig } from './lib/utils/handle-config'
import { handleEmpty } from './lib/utils/handle-empty'
import { handleExit } from './lib/utils/handle-exit'
import { runCmd } from './lib/utils/run-cmd'
import { showHeader } from './lib/utils/show-header'
import { handleTimeout } from './lib/utils/timeout'

const program = Effect.gen(function* () {
  const opts = optionsStore.getState()

  handleEmpty()
  yield* showHeader

  // run timeout handler in the background
  yield* Effect.fork(handleTimeout)

  // run all commands in parallel
  yield* Effect.forEach(opts.commands, cmd => runCmd(cmd), {
    concurrency: 'unbounded',
  })
})

export async function handleAction(cmds: string[], options: ProgramOptions) {
  // initialize options store
  const configExit = await handleConfig(cmds, options).pipe(
    Effect.runPromiseExit,
  )
  handleExit(configExit)

  const programExit = await program.pipe(Effect.runPromiseExit)
  handleExit(programExit)
}
