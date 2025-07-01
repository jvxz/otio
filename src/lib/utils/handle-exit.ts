import { Cause, Exit, Option } from 'effect'
import { log } from '../log'

export function handleExit<E, A extends { message: string }>(
  exit: Exit.Exit<E, A>,
) {
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
