import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  TextChannel,
  type Interaction
} from 'discord.js';
import { clearConversations } from '../discord';

export default {
  data: new SlashCommandBuilder().setName('clear').setDescription('Clear the chat'),
  async execute(interaction: Interaction) {
    const isChatCommand = interaction instanceof ChatInputCommandInteraction;
    const isTextChannel = interaction.channel instanceof TextChannel;
    if (!isChatCommand || !isTextChannel) return;

    await interaction.reply('Clearing chat conversations...');
    await clearConversations(interaction.channel);
  }
};
