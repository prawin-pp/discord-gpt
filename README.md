# Discord Chatbot with OpenAI API + Apple iPhone Stock Checker

This project combines:
1. **Discord Chatbot** - Uses OpenAI's GPT to generate responses for your Discord chat
2. **Apple Stock Checker** - Automated bot to check iPhone stock availability in Thailand using Playwright

## Prerequisites

- Node.js (LTS version)
- OpenAI API key (for chatbot features)
- Discord API key (for chatbot features)
- Discord Webhook URL (for stock notifications)

## Installation

1. Clone the repository.

2. Run the following command to install dependencies:

```bash
npm install
```

3. Install Playwright browsers:

```bash
npx playwright install chromium
```

4. Create a .env file in your project root directory and add the following environment variables:

```bash
# Discord Chatbot Configuration
VITE_CHAT_GPT_API_KEY=<your_api_key>
VITE_CHAT_GPT_MODEL=gpt-4
VITE_CHAT_GPT_MAX_TOKENS=2000
VITE_DISCORD_TOKEN=<your_discord_token>
VITE_DISCORD_APP_ID=<your_discord_app_id>
VITE_DISCORD_GUILD_ID=<your_discord_guild_id>

# Apple Stock Checker Configuration
VITE_APPLE_CRONTAB=*/10 * * * *
VITE_APPLE_LINK=https://www.apple.com/th/shop/buy-iphone/iphone-17-pro/...
VITE_APPLE_WEBHOOK=https://discord.com/api/webhooks/YOUR_WEBHOOK_URL
```

## Usage

### Discord Chatbot

1. Invite the bot to your server with the following link (replace YOUR_APP_ID_HERE with the bot's App ID):

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_APP_ID_HERE&permissions=10240&scope=bot%20applications.commands
```

2. Add the bot to a channel and start chatting!

### Apple Stock Checker

1. **Test the stock checker** (recommended first):

```bash
npm run test:stock
```

This will run a single check and show you the results.

2. **Run the bot** (starts both chatbot and stock checker):

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm start
```

The stock checker will automatically run based on your cron schedule.

For detailed instructions on setting up the Apple Stock Checker, see [APPLE_STOCK_CHECKER.md](./APPLE_STOCK_CHECKER.md).

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Acknowledgements

This project makes use of the [OpenAI API](https://platform.openai.com/). Special thanks to the Discord.js library for making the development of this chatbot possible.

You can modify the content of the README file to suit your specific needs. Please note that the .env file should not be committed, as it contains sensitive information. Instead, you should include instructions on how to create the .env file with the required environment variables. Good luck with your project!
