import { execa } from 'execa'
import { taskSignal } from '../abort'

export function makeProcess(cmd: string) {
  const [command, ...args] = cmd.split(' ')

  if (!command) {
    throw new Error(`command is empty: ${cmd}`)
  }

  const proc = execa(command, args, {
    cancelSignal: taskSignal,
    stdio: 'inherit',
  })

  return proc
}
