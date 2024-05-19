import type {
  ChatCompletionAssistantMessageParam,
  ChatCompletionUserMessageParam
} from 'openai/resources/chat';

export type CreateChatCompletionRequest =
  | ChatCompletionUserMessageParam
  | ChatCompletionAssistantMessageParam;
