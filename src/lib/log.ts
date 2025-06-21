import c from 'chalk'

export const log = {
  break: () => {
    console.log('')
  },
  error: (msg: string, prefix: string = ' error ') => {
    console.log(c.red.inverse.bold(prefix), c.red(msg))
  },
  info: (msg: string) => {
    console.log(c.gray(msg))
  },
}
