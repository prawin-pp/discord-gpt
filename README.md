# Discord Chatbot with OpenAI API

This chatbot uses OpenAI's GPT3 to generate responses for your Discord chat application.

## Prerequisites

- OpenAI API key
- Discord API key

## Installation

1. Clone the repository.

2. Run the following command to install dependencies:

```
npm install
```

3. Create a .env file in your project root directory and add the following environment variables:

```
VITE_CHAT_GPT_API_KEY=<your_api_key>
VITE_CHAT_GPT_MODEL=<your_model>
VITE_CHAT_GPT_MAX_TOKENS=<max_tokens>
VITE_DISCORD_TOKEN=<your_discord_token>
VITE_DISCORD_APP_ID=<your_discord_app_id>
VITE_DISCORD_GUILD_ID=<your_discord_guild_id>
```

## Usage

1. Run the following command to start the bot:

```
npm run dev
```

2. Invite the bot to your server with the following link (replace YOUR_APP_ID_HERE with the bot's App ID):

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_APP_ID_HERE&permissions=10240&scope=bot%20applications.commands
```

3. Add the bot to a channel.

4. Start chatting on Discord!

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Acknowledgements

This project makes use of the [OpenAI API](https://platform.openai.com/). Special thanks to the Discord.js library for making the development of this chatbot possible.

You can modify the content of the README file to suit your specific needs. Please note that the .env file should not be committed, as it contains sensitive information. Instead, you should include instructions on how to create the .env file with the required environment variables. Good luck with your project!
