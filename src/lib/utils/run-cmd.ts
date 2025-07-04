import { Data, Effect } from 'effect'
import { makeProcess } from './make-process'

class RunCmdError extends Data.TaggedError('RunCmdError')<{
  cause?: unknown
  message?: string
}> {}

export function runCmd(cmd: string) {
  return Effect.gen(function* () {
    const cmdProc = yield* Effect.try({
      catch: error => {
        return new RunCmdError({
          cause: String(error),
          message: `unknown error occured when running command: ${cmd}`,
        })
      },
      try: () => makeProcess(cmd),
    })

    return cmdProc
  })
}
