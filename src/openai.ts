import { OpenAI as OpenAIApi } from 'openai';
import type { ChatCompletionMessage } from 'openai/resources/chat';

interface OpenAIConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
}

export class OpenAI {
  private _client: OpenAIApi;
  private _config: OpenAIConfig;

  constructor(config: OpenAIConfig) {
    this._client = new OpenAIApi({ apiKey: config.apiKey });
    this._config = config;
  }

  async createChatCompletion(chats: ChatCompletionMessage[]) {
    const messages: ChatCompletionMessage[] = [
      { role: 'system', content: 'You are a friendly and clever chatbot.' },
      ...chats.map((chat) => ({ role: chat.role, content: chat.content }))
    ];
    const result = await this._client.chat.completions.create({
      model: this._config.model,
      max_tokens: this._config.maxTokens,
      messages: messages
    });
    return result.choices?.[0]?.message?.content ?? `I don't know what to say.`;
  }
}
