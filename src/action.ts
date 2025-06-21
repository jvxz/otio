import type { ProgramOptions } from './cli'

export function handleAction(cmds: string[], options: ProgramOptions) {
  console.log(cmds)
  if (options.timeout) {
    console.log('with timeout:', options.timeout)
  }
}
