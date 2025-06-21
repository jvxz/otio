import c from 'chalk'
import { Data, Effect } from 'effect'
import { ExecaError, execa } from 'execa'
import { log } from '../log'

class RunCmdError extends Data.TaggedError('RunCmdError')<{
  cause?: unknown
  message?: string
}> {}

export function runCmd(cmd: string) {
  return Effect.gen(function* () {
    const [command, ...args] = cmd.split(' ')

    if (!command)
      return yield* Effect.fail(
        new RunCmdError({
          cause: `command is empty`,
          message: `command is empty`,
        }),
      )

    const cmdProc = yield* Effect.tryPromise({
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
      try: async () => {
        const proc = execa(command, args, { stdio: 'inherit' })

        proc.on('close', code => {
          log.error(`command ${c.red.bold(cmd)} exited with code ${code}`)
          process.exit(code ?? 1)
        })

        return proc
      },
    })

    return cmdProc
  })
}
