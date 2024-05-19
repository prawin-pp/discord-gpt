import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  TextChannel,
  type Interaction
} from 'discord.js';
import { OpenAI } from '../openai';

export default {
  data: new SlashCommandBuilder()
    .setName('openai')
    .setDescription('Setup OpenAI chatbot')
    .addStringOption((option) =>
      option
        .setName('system_message')
        .setDescription('Update system message')
        .setRequired(true)
        .addChoices([
          { name: 'get', value: 'get' },
          { name: 'set', value: 'set' }
        ])
    )
    .addStringOption((option) =>
      option.setName('input').setDescription('Input for settings').setRequired(false)
    ),
  async execute(interaction: Interaction) {
    const isChatCommand = interaction instanceof ChatInputCommandInteraction;
    const isTextChannel = interaction.channel instanceof TextChannel;
    if (!isChatCommand || !isTextChannel) return;

    const command = interaction.options.getString('system_message');
    const input = interaction.options.getString('input');

    if (command === 'get') {
      await interaction.reply(`Current system message: \`${OpenAI.systemMessage.content}\``);
    } else if (command === 'set' && input) {
      const current = OpenAI.systemMessage.content;
      await interaction.reply(
        `Current system message: \`${current}\`\n\nNew system message: \`${input}\``
      );
      OpenAI.systemMessage.content = input;
    }
  }
};
