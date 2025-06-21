import c from 'chalk'

export const log = {
  break: () => {
    console.log('')
  },
  error: (msg: string) => {
    console.log(c.red(msg))
  },
  info: (msg: string) => {
    console.log(c.gray(msg))
  },
}
