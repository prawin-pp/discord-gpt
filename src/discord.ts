import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  Message,
  REST,
  Routes,
  type Interaction
} from 'discord.js';
import type { ChatCompletionRequestMessage } from 'openai';
import { clear } from './commands';
import { splitMessage } from './utils/message';

interface DiscordConfig {
  token: string;
  channelId: string;
  appId: string;
  guildId: string;
}

interface Conversation extends ChatCompletionRequestMessage {
  replyTo?: string;
}

interface Assistant {
  createChatCompletion(chats: ChatCompletionRequestMessage[]): Promise<string>;
}

export class Discord {
  private _client: Client;
  private _rest: REST;
  private _config: DiscordConfig;
  private _assistant: Assistant;

  constructor(config: DiscordConfig, assistant: Assistant) {
    this._client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
        // GatewayIntentBits.DirectMessageReactions,
        // GatewayIntentBits.GuildIntegrations
      ]
    });
    this._client.commands = new Collection();
    this._rest = new REST().setToken(config.token);
    this._config = config;
    this._assistant = assistant;
  }

  async registerCommands() {
    const commands = [clear];

    for (const command of commands) {
      this._client.commands.set(command.data.name, command);
    }

    try {
      console.info(`[DISCORD]: start register commands.`);
      const path = Routes.applicationGuildCommands(this._config.appId, this._config.guildId);
      const body = commands.map((command) => command.data.toJSON());
      await this._rest.put(path, { body });
      console.info(`[DISCORD]: register ${commands.length} commands successfully.`);
    } catch (error) {
      console.error(error);
    }
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

    await message.channel.sendTyping();

    const prev = await message.channel.messages.fetch({ limit: 20 });
    prev.reverse();

    const conversations: Conversation[] = [];
    prev.forEach((msg) => {
      if (msg.author.bot && msg.mentions.repliedUser?.id === message.author.id) {
        const replyTo = msg.reference?.messageId;
        const conversation = conversations.find((m) => m.replyTo === replyTo);
        if (conversation) {
          conversation.content += `\n${msg.content}`;
        } else {
          conversations.push({ role: 'assistant', content: msg.content, replyTo: replyTo });
        }
      } else if (!msg.author.bot && msg.author.id === message.author.id) {
        conversations.push({ role: 'user', content: msg.content });
      }
    });

    const autocomplete = await this._assistant.createChatCompletion(conversations);
    const result = splitMessage(autocomplete);

    for (let i = 0; i < result.length; i++) {
      await message.reply(result[i]);
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
}
