import { Data, Effect } from 'effect'
import { ExecaError } from 'execa'
import { makeProcess } from './make-process'

class RunCmdError extends Data.TaggedError('RunCmdError')<{
  cause?: unknown
  message?: string
}> {}

export function runCmd(cmd: string) {
  return Effect.gen(function* () {
    const cmdProc = yield* Effect.try({
      catch: error => {
        if (error instanceof ExecaError)
          return new RunCmdError({
            cause: error,
            message: error.message,
          })

        return new RunCmdError({
          cause: String(error),
          message: `unknown error occured when running command: ${cmd}`,
        })
      },
      try: () => {
        // create process as a promise
        const proc = makeProcess(cmd)

        // handle process exit
        proc.on('close', code => {
          process.exit(code ?? 1)
        })

        return proc
      },
    })

    return cmdProc
  })
}
