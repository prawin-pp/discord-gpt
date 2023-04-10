import { SlashCommandBuilder, type Interaction } from 'discord.js';

export default {
  data: new SlashCommandBuilder().setName('clear').setDescription('Clear the chat'),
  async execute(interaction: Interaction) {
    console.log(`clear the char`);
  }
};
