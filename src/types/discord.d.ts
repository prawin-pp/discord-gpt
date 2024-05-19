import type { Collection, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from 'discord.js';

declare module 'discord.js' {
  export interface Client {
    commands: Collection<
      string,
      {
        data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
        execute: (interaction: Interaction) => Promise<void>;
      }
    >;
  }
}
