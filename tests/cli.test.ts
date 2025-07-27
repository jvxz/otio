import { spawn } from 'node:child_process'
import { describe, expect, it } from 'vitest'

describe('cli', () => {
  it('should show the help message', async () => {
    const proc = spawn('bun', ['run', 'start', '--help'])

    let text = ''
    proc.stdout.on('data', data => {
      text += data.toString()
    })

    await new Promise(resolve => {
      proc.on('close', resolve)
    })

    expect(text).toContain('forget about your dev servers')
  })

  it('should fail due to invalid number', async () => {
    const proc = spawn('bun', ['run', 'start', '-t', 'hi'])

    await new Promise(resolve => {
      proc.on('close', resolve)
    })

    expect(proc.exitCode).toBe(1)
  })
})
