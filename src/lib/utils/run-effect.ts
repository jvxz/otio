import { Cause, Effect, Exit, Option } from 'effect'
import { log } from '../log'

export async function runEffect<A, E extends Error, R extends never>(
  effect: Effect.Effect<A, E, R>,
) {
  const exit = await effect.pipe(Effect.runPromiseExit)

  Exit.match(exit, {
    onFailure: error => {
      const cause = Cause.failureOption(error)

      if (Option.isSome(cause)) {
        log.error(cause.value.message)
        if (process.env.NODE_ENV === 'development') {
          log.error(String(cause.value.cause))
        }
      }

      process.exit(1)
    },
    onSuccess: () => {},
  })
}
