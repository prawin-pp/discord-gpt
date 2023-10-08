import type { ChatCompletionMessage } from 'openai/resources/chat';

export interface Conversation extends ChatCompletionMessage {
  replyTo?: string;
}
