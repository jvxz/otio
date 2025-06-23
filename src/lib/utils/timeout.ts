import { watch } from 'chokidar'
import cursor from 'cli-cursor'
import { Data, Duration, Effect, Fiber, Runtime } from 'effect'
import { taskAbortController } from '../abort'
import { log } from '../log'

class TimeoutError extends Data.TaggedError('TimeoutError')<{
  cause?: unknown
  message?: string
}> {}

type HandleTimeoutOptions = {
  timeout: number
  dir: string
}

function makeTimeout(opts: HandleTimeoutOptions) {
  return Effect.gen(function* () {
    // main timer
    yield* Effect.sleep(Duration.seconds(opts.timeout))

    // log when timeout is reached
    log.break()
    log.info('timeout reached. exiting...')

    // abort all ongoing execa processes
    taskAbortController.abort()

    cursor.show()

    return yield* Effect.succeed('timeout reached')
  })
}

function resetTimeout(
  fiber: Fiber.Fiber<string, TimeoutError>,
  opts: HandleTimeoutOptions,
) {
  return Effect.gen(function* () {
    // interrupt (cancel) ongoing timer
    yield* Fiber.interrupt(fiber)

    // start new timer as a fiber
    return yield* Effect.fork(makeTimeout(opts))
  })
}

export function handleTimeout(opts: HandleTimeoutOptions) {
  return Effect.gen(function* () {
    const runtime = yield* Effect.runtime()

    // start first timer as a fiber
    let timeoutFiber = Runtime.runFork(runtime)(makeTimeout(opts))

    const watcher = watch(opts.dir, { ignored: /node_modules|\.git/ })

    watcher.on('change', () => {
      Runtime.runFork(runtime)(resetTimeout(timeoutFiber, opts))

      const fiber = Runtime.runFork(runtime)(makeTimeout(opts))

      // re-assign fiber to the new timer
      timeoutFiber = fiber
    })
  })
}
