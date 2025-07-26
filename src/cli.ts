import { Argument, Command } from '@commander-js/extra-typings'
import { description, name, version } from '../package.json'
import { handleAction } from './action'

export const cli = new Command()
  .name(name)
  .version(version)
  .description(description)
  .addArgument(new Argument('[commands...]', 'the command(s) to run'))
  .option(
    '-t, --timeout <timeout>',
    'how long (in seconds) the process should be idle for before shutting down',
    '180',
  )
  .option('--no-header', 'do not display header when running commands')
  .option('-d, --dir <dir>', 'the directory to watch for changes', '.')
  .option('-v, --verbose', 'show verbose output', false)

  .addHelpText(
    'after',
    `
Examples:
  $ otio "npm run dev" -t 10
  `,
  )

  .action(handleAction)

export type ProgramOptions = ReturnType<typeof cli.opts>
