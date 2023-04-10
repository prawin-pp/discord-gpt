import { Configuration, OpenAIApi, type ChatCompletionRequestMessage } from 'openai';

interface OpenAIConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
}

export class OpenAI {
  private _client: OpenAIApi;
  private _config: OpenAIConfig;

  constructor(config: OpenAIConfig) {
    const configuration = new Configuration({ apiKey: config.apiKey });
    this._client = new OpenAIApi(configuration);
    this._config = config;
  }

  async createChatCompletion(chats: ChatCompletionRequestMessage[]) {
    const messages: ChatCompletionRequestMessage[] = [
      { role: 'system', content: 'You are a friendly and clever chatbot.' },
      ...chats.map((chat) => ({ role: chat.role, content: chat.content }))
    ];
    const result = await this._client.createChatCompletion({
      model: this._config.model,
      max_tokens: this._config.maxTokens,
      messages: messages,
    });

    return result.data.choices?.[0]?.message?.content ?? `I don't know what to say.`;
  }
}
