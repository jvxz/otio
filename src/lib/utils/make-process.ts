import child_process from 'node:child_process'
import c from 'chalk'
import { taskSignal } from '../abort'
import { log } from '../log'

export function makeProcess(rawCmd: string) {
  const [command, ...args] = rawCmd.split(' ')

  if (!command) {
    throw new Error(`command is empty: ${rawCmd}`)
  }

  const proc = child_process.spawn(command, args, {
    shell: true,
    signal: taskSignal,
    stdio: 'inherit',
    windowsHide: false,
  })

  proc.on('exit', code => {
    log.warn(`${c.bold(rawCmd)} exited with code: ${code}`)
  })

  return proc
}
