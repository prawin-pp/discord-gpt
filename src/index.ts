import { config } from './config';
import { Discord } from './discord';

const discord = new Discord(config.discord);

await discord.registerCommands();

discord.start();
