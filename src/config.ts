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
    crontab: import.meta.env.VITE_APPLE_CRONTAB || `*/10 * * * *`,
    link:
      import.meta.env.VITE_APPLE_LINK ||
      `https://www.apple.com/th/shop/fulfillment-messages?pl=true&mts.0=regular&mts.1=compact&cppart=UNLOCKED/WW&parts.0=MYWW3ZP/A&location=10150`,
    webhook:
      import.meta.env.VITE_APPLE_WEBHOOK ||
      `https://discord.com/api/webhooks/1287726384273293332/RA3eYYamrXtGgY9154Q4igHdTwLqiIzBlgcWD6OqtLshwVsuKJjs_bVx_XNabMD4kVL5`
  }
};
