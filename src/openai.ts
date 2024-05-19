import { OpenAI as OpenAIApi } from 'openai';
import type {
  ChatCompletionMessageParam,
  ChatCompletionSystemMessageParam
} from 'openai/resources/chat';
import type { CreateChatCompletionRequest } from './types/openai';

interface OpenAIConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
}

export class OpenAI {
  private api: OpenAIApi;
  private config: OpenAIConfig;

  systemMessage: ChatCompletionSystemMessageParam = {
    role: 'system',
    content: `You are a highly experienced technical lead with over 10 years of experience in software development. Provide detailed, accurate, and authoritative answers to programming questions. Your guidance should reflect deep expertise and insight.`
  };

  constructor(config: OpenAIConfig) {
    this.api = new OpenAIApi({ apiKey: config.apiKey });
    this.config = config;
  }

  async createChatCompletion(chats: CreateChatCompletionRequest[]): Promise<string> {
    const messages: ChatCompletionMessageParam[] = [this.systemMessage, ...chats];
    const result = await this.api.chat.completions.create({
      model: this.config.model,
      max_tokens: this.config.maxTokens,
      messages: messages
    });
    return result.choices?.[0]?.message?.content ?? `Sorry, I had an issue processing your request`;
  }
}
