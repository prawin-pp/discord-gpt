/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHAT_GPT_API_KEY: string;
  readonly VITE_CHAT_GPT_MODEL: string;
  readonly VITE_DISCORD_TOKEN: string;
  readonly VITE_DISCORD_APP_ID: string;
  readonly VITE_DISCORD_GUILD_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
