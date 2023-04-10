import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
  type Interaction
} from 'discord.js';
import { clear } from './commands';

interface DiscordConfig {
  token: string;
  channelId: string;
  appId: string;
  guildId: string;
}

export class Discord {
  private _client: Client;
  private _rest: REST;
  private _config: DiscordConfig;

  constructor(config: DiscordConfig) {
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
    this._client.login(this._config.token);
  }

  private async _onInteractionCreate(interaction: Interaction) {
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
  }

  private _onClientReady(client: Client) {
    console.info(`[DISCORD]: Ready! Logged in as ${client.user?.tag}`);
  }
}
