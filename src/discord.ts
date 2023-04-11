import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  Message,
  REST,
  Routes,
  TextChannel,
  type Channel,
  type ClientOptions,
  type Interaction
} from 'discord.js';
import type { ChatCompletionRequestMessage } from 'openai';
import { discordCommands } from './commands';
import { Utils } from './utils';
import { assembleChatCompletionRequest } from './utils/message';

interface DiscordConfig {
  token: string;
  appId: string;
  guildId: string;
}

interface Assistant {
  createChatCompletion(chats: ChatCompletionRequestMessage[]): Promise<string>;
}

export class Discord {
  private _client: Client;
  private _config: DiscordConfig;
  private _assistant: Assistant;
  private _rest: REST;

  constructor(config: DiscordConfig, assistant: Assistant) {
    const options: ClientOptions = {
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    };
    this._client = new Client(options);
    this._config = config;
    this._assistant = assistant;
    this._rest = new REST().setToken(config.token);
    this._client.commands = new Collection();
    discordCommands.forEach((command) => {
      this._client.commands.set(command.data.name, command);
    });
  }

  start() {
    this._client.once(Events.ClientReady, this._onClientReady);
    this._client.on(Events.InteractionCreate, this._onInteractionCreate);
    this._client.on(Events.MessageCreate, this._onMessageCreate);
    return this._client.login(this._config.token);
  }

  private _onMessageCreate = async (message: Message) => {
    const isBotMessage = message.author.bot;
    if (isBotMessage) return;

    if (message.content === '!command' && message.guildId) {
      await this._registerBotCommands(message.guildId);
      return;
    }

    try {
      await message.channel.sendTyping();
      const chatHistory = (await message.channel.messages.fetch({ limit: 20 })).reverse();
      const req = assembleChatCompletionRequest(message.author.id, chatHistory);
      const autocomplete = await this._assistant.createChatCompletion(req);
      const result = Utils.splitMessage(autocomplete);
      for (let i = 0; i < result.length; i++) {
        await message.reply(result[i]);
      }
    } catch (err) {
      console.error(err);
      await message.reply('Sorry, I am not feeling well today. Please try again later. :(');
    }
  };

  private _onInteractionCreate = async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
      console.error(`[DISCORD]: No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          ephemeral: true
        });
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true
        });
      }
    }
  };

  private _onClientReady = (client: Client) => {
    console.info(`[DISCORD]: Ready! Logged in as ${client.user?.tag}`);
  };

  private _registerBotCommands = async (guildId: string) => {
    try {
      console.info(`[DISCORD]: start register bot commands to gid=${guildId}.`);
      const { appId } = this._config;
      const path = Routes.applicationGuildCommands(appId, guildId);
      const body = discordCommands.map((command) => command.data.toJSON());
      await this._rest.put(path, { body });
      console.info(`[DISCORD]: register bot commands to gid=${guildId} successfully.`);
    } catch (error) {
      console.error(error);
    }
  };
}

export const clearConversations = async (channel: Channel) => {
  if (!(channel instanceof TextChannel)) return;
  let messages: Collection<string, Message<boolean>>;
  do {
    messages = await channel.messages.fetch({ limit: 20 });
    messages = messages.filter((msg) => msg.deletable);
    if (messages.size === 0) break;
    await channel.bulkDelete(messages);
  } while (messages?.size > 0);
};
