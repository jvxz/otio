import { z } from 'zod/v4'

export const ConfigSchema = z
  .strictObject({
    // $schema: z.string().describe('The schema for the config file'),
    commands: z
      .array(
        z
          .string()
          .min(1),
        // z.union([
        //   z.string(),
        //   z.object({ command: z.string(), prefix: z.string() }),
        // ]),
      )
      .describe('The commands to run'),
    dir: z.string().min(1).describe('The directory to run the commands in'),
    forceKill: z.boolean().describe('Whether to force kill the commands'),
    header: z.boolean().describe('Whether to show the header'),
    // messages: z.object({
    //   header: z.object({
    //     enabled: z.boolean().describe('Whether to show the header'),
    //     text: z.string().describe('The text to show in the header'),
    //   }),
    //   timeout: z.object({
    //     enabled: z.boolean().describe('Whether to show the timeout'),
    //     text: z.string().describe('The text to show in the timeout'),
    //   }),
    // }),
    timeout: z.coerce.string().min(1),
    verbose: z.boolean().describe('Whether to show verbose output'),
  })
  .partial()

export type Config = z.infer<typeof ConfigSchema>
