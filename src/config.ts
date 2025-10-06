export const config = {
  discord: {
    token: import.meta.env.VITE_DISCORD_TOKEN,
    channelId: import.meta.env.VITE_DISCORD_CHANNEL_ID,
    appId: import.meta.env.VITE_DISCORD_APP_ID,
    guildId: import.meta.env.VITE_DISCORD_GUILD_ID
  },
  chatGpt: {
    apiKey: import.meta.env.VITE_CHAT_GPT_API_KEY,
    model: import.meta.env.VITE_CHAT_GPT_MODEL,
    maxTokens: parseInt(import.meta.env.VITE_CHAT_GPT_MAX_TOKENS)
  },
  apple: {
    crontab: import.meta.env.VITE_APPLE_CRONTAB || `*/2 * * * *`,
    link: import.meta.env.VITE_APPLE_LINK,
    link2: import.meta.env.VITE_APPLE_LINK_2,
    webhook: import.meta.env.VITE_APPLE_WEBHOOK,
    postcode: import.meta.env.VITE_APPLE_POSTCODE || '10150'
  }
};
