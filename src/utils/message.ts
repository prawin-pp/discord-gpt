import type { Collection, Message } from 'discord.js';
import type { Conversation } from '../models/discord';

// From: https://github.com/discordjs/discord.js/blob/v13/src/util/Util.js#L83
export const splitMessage = (
  text: string,
  { maxLength = 2_000, char = '\n', prepend = '', append = '' } = {}
) => {
  if (text.length <= maxLength) return [text];
  let splitText = [text];
  if (Array.isArray(char)) {
    while (char.length > 0 && splitText.some((elem) => elem.length > maxLength)) {
      const currentChar = char.shift();
      if (currentChar instanceof RegExp) {
        splitText = splitText.flatMap((chunk) => chunk.match(currentChar)) as string[];
      } else {
        splitText = splitText.flatMap((chunk) => chunk.split(currentChar)) as string[];
      }
    }
  } else {
    splitText = text.split(char);
  }
  if (splitText.some((elem) => elem.length > maxLength)) throw new RangeError('SPLIT_MAX_LEN');
  const messages = [];
  let msg = '';
  for (const chunk of splitText) {
    if (msg && (msg + char + chunk + append).length > maxLength) {
      messages.push(msg + append);
      msg = prepend;
    }
    msg += (msg && msg !== prepend ? char : '') + chunk;
  }
  return messages.concat(msg).filter((m) => m);
};

export const assembleChatCompletionRequest = (
  senderId: string,
  messages: Collection<string, Message<boolean>>
): Array<Conversation> => {
  const result: Array<Conversation> = [];
  for (const [, message] of messages) {
    if (message.author.bot && message.mentions.repliedUser?.id === senderId) {
      const replyTo = message.reference?.messageId;
      const conversation = result.find((item) => item.replyTo === replyTo);
      if (conversation) {
        conversation.content += `\n${message.content}`;
      } else {
        result.push({ role: 'assistant', content: message.content, replyTo: replyTo });
      }
    } else if (!message.author.bot && message.author.id === senderId) {
      result.push({ role: 'user', content: message.content });
    }
  }
  return result;
};
