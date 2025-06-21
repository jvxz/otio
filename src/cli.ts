import { Argument, Command } from '@commander-js/extra-typings'
import { description, name, version } from '../package.json'
import { handleAction } from './action'

export const program = new Command()
  .name(name)
  .version(version)
  .description(description)
  .addArgument(new Argument('<commands...>', 'the command(s) to run'))
  .option(
    '-t, --timeout <timeout>',
    '(in seconds) how long the process should be idle for before shutting down',
  )
  .option('--no-header', 'do not display header when running commands')
  .action(handleAction)

export type ProgramOptions = ReturnType<typeof program.opts>
