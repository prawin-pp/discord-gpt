import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js';
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
}
