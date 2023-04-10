import { config } from './config';
import { Discord } from './discord';
import { OpenAI } from './openai';

const openai = new OpenAI(config.chatGpt);
const discord = new Discord(config.discord, openai);

await discord.registerCommands();

await discord.start();
