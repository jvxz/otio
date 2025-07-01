import { Data, Effect } from 'effect'
import z, { ZodError } from 'zod/v4'
import type { ProgramOptions } from '../../cli'
import { ConfigSchema } from '../schema/config-schema'
import { type OptionsState, optionsStore } from '../store/opts'

class ConfigReadError extends Data.TaggedError('ConfigReadError')<{
  cause?: unknown
  message?: string
}> {}

export function handleConfig(
  argsCommands: string[],
  argsOptions: ProgramOptions,
) {
  return Effect.gen(function* (_) {
    const file = yield* Effect.tryPromise({
      catch: e =>
        new ConfigReadError({ cause: e, message: 'Failed to read config' }),
      try: async () => {
        const exists = await Bun.file('otio.json').exists()

        if (!exists) {
          return
        }

        return Bun.file('otio.json')
      },
    })

    if (!file) {
      const cfg: OptionsState = {
        ...argsOptions,
        commands: argsCommands,
      }

      optionsStore.setState(cfg)

      return cfg
    }

    const content = yield* Effect.tryPromise({
      catch: e =>
        new ConfigReadError({ cause: e, message: 'Failed to read config' }),
      try: async () => await file.json(),
    })

    const fileOpts = yield* _(
      Effect.try({
        catch: e => {
          if (e instanceof ZodError) {
            new ConfigReadError({
              cause: e,
              message: `Invalid config:
${z.prettifyError(e)}
`,
            })

            new ConfigReadError({
              cause: e,
              message: 'Failed to parse config',
            })
          }

          return new ConfigReadError({
            cause: e,
            message: 'Failed to parse config',
          })
        },
        try: () => ConfigSchema.parse(content),
      }),
    )

    const config: OptionsState = mergeOptions(
      optionsStore.getInitialState(),
      fileOpts,
      argsOptions,
      argsCommands,
    )

    optionsStore.setState(config)

    return config
  })
}

function mergeOptions(
  defaultOpts: OptionsState,
  fileOpts: Partial<OptionsState>,
  argsOptions: ProgramOptions,
  argsCommands: string[],
): OptionsState {
  const commands = fileOpts.commands ?? argsCommands
  const timeout = fileOpts.timeout ?? argsOptions.timeout ?? defaultOpts.timeout
  const header = fileOpts.header ?? argsOptions.header ?? defaultOpts.header
  const dir = fileOpts.dir ?? argsOptions.dir ?? defaultOpts.dir
  const verbose = fileOpts.verbose ?? argsOptions.verbose ?? defaultOpts.verbose

  return {
    commands,
    dir,
    header,
    timeout,
    verbose,
  }
}
