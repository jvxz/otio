import { Effect } from 'effect'
import type { ProgramOptions } from './cli'
import { optionsStore } from './lib/store/opts'
import { handleEmpty } from './lib/utils/handle-empty'
import { handleOptions } from './lib/utils/handle-options'
import { runCmd } from './lib/utils/run-cmd'
import { runEffect } from './lib/utils/run-effect'
import { showHeader } from './lib/utils/show-header'
import { handleTimeout } from './lib/utils/timeout'

const program = Effect.gen(function* () {
  const opts = optionsStore.getState()

  handleEmpty()
  yield* showHeader

  // run timeout handler in the background
  yield* Effect.fork(handleTimeout)

  // run all commands in parallel
  yield* Effect.forEach(opts.cmds, cmd => runCmd(cmd), {
    concurrency: 'unbounded',
  })
})

export async function handleAction(cmds: string[], options: ProgramOptions) {
  await runEffect(handleOptions(cmds, options))
  await runEffect(program)
}
