import { watch } from 'chokidar'
import cursor from 'cli-cursor'
import { Data, Duration, Effect, Fiber, Runtime } from 'effect'
import { taskAbortController } from '../abort'
import { log } from '../log'
import { optionsStore } from '../store/opts'

class TimeoutError extends Data.TaggedError('TimeoutError')<{
  cause?: unknown
  message?: string
}> {}

const makeTimeout = Effect.gen(function* () {
  const opts = optionsStore.getState()

  // main timer
  yield* Effect.sleep(Duration.seconds(Number(opts.timeout)))

  // log when timeout is reached
  log.break()
  log.info('timeout reached. exiting...')

  // abort all ongoing execa processes
  log.debug('aborting processes...')
  taskAbortController.abort()

  log.debug('restoring cursor...')
  cursor.show()

  return yield* Effect.succeed('timeout reached')
})

function resetTimeout(fiber: Fiber.Fiber<string, TimeoutError>) {
  return Effect.gen(function* () {
    log.debug('resetting timeout fiber...')

    // interrupt (cancel) ongoing timer
    yield* Fiber.interrupt(fiber)

    // start new timer as a fiber
    return yield* Effect.fork(makeTimeout)
  })
}

export const handleTimeout = Effect.gen(function* () {
  const opts = optionsStore.getState()

  const runtime = yield* Effect.runtime()

  // start first timer as a fiber
  let timeoutFiber = Runtime.runFork(runtime)(makeTimeout)
  log.debug(`starting first timeout fiber... (${opts.timeout}s)`)

  const watcher = watch(opts.dir, { ignored: /node_modules|\.git/ })

  watcher.on('change', dir => {
    log.debug(`file changed... (${dir})`)

    Runtime.runFork(runtime)(resetTimeout(timeoutFiber))

    const fiber = Runtime.runFork(runtime)(makeTimeout)

    // re-assign fiber to the new timer
    timeoutFiber = fiber
  })
})
