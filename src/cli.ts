import { Argument, Command } from 'commander'
import { description, name, version } from '../package.json'

export const program = new Command()

program.name(name).version(version).description(description)

program
  .addArgument(new Argument('<commands...>', 'the command(s) to run'))
  .action((e, o) => {
    console.log(e, o)
  })

program.option(
  '-t, --timeout <timeout>',
  '(in seconds) how long the process should be idle for before shutting down',
)

program.parse()
