import {
  ChatInputCommandInteraction,
  Collection,
  Message,
  SlashCommandBuilder,
  TextChannel,
  type Interaction
} from 'discord.js';

export default {
  data: new SlashCommandBuilder().setName('clear').setDescription('Clear the chat'),
  async execute(interaction: Interaction) {
    const isChatCommand = interaction instanceof ChatInputCommandInteraction;
    const isTextChannel = interaction.channel instanceof TextChannel;
    if (!isChatCommand || !isTextChannel) return;

    await interaction.reply('ok');

    let messages: Collection<string, Message<boolean>>;
    do {
      messages = await interaction.channel.messages.fetch({ limit: 20 });
      messages = messages.filter((msg) => msg.deletable);
      if (messages.size > 0) {
        await interaction.channel.bulkDelete(messages);
      }
    } while (messages?.size > 0);
  }
};
