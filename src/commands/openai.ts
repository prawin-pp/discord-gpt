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
      option.setName('system').setDescription('The command to run').setRequired(true)
    ),
  async execute(interaction: Interaction) {
    const isChatCommand = interaction instanceof ChatInputCommandInteraction;
    const isTextChannel = interaction.channel instanceof TextChannel;
    if (!isChatCommand || !isTextChannel) return;

    const command = interaction.options.getString('system');
    if (!command) return;

    const old = OpenAI.systemMessage.content;
    await interaction.channel.send(
      `Current system message: \`${old}\`\n\nNew system message: \`${command}\``
    );

    OpenAI.systemMessage.content = command;
  }
};
