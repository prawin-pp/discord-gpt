import type { ChatCompletionRequestMessage } from 'openai';

export interface Conversation extends ChatCompletionRequestMessage {
  replyTo?: string;
}
