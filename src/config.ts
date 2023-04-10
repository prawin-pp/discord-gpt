export const config = {
  discord: {
    token: import.meta.env.VITE_DISCORD_TOKEN,
    channelId: import.meta.env.VITE_DISCORD_CHANNEL_ID,
    appId: import.meta.env.VITE_DISCORD_APP_ID,
    guildId: import.meta.env.VITE_DISCORD_GUILD_ID
  },
  chatGpt: {
    apiKey: import.meta.env.VITE_CHAT_GPT_API_KEY
  }
};
