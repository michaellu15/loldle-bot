require('dotenv').config();
const token = process.env.DISCORD_TOKEN;
const { Client, GatewayIntentBits, Collection } = require('discord.js')
const fs = require('fs')
const path = require('path')
const express = require('express');
const app = express();

const PREFIX = '?';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})
client.commands = new Collection();

//load command files
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)

    if (command.name && command.execute) {
        client.commands.set(command.name, command);
    }
}
//bot turned on
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`)
})
//check message sent in server
client.on("messageCreate", async (message) => {
    //msg doesn't start with prefix or is sent with bot
    if (!message.content.startsWith(PREFIX) || message.author.bot) {
        return;
    }

    //break the message into the commandName and the args
    const [commandName, ...args] = message.content.slice(PREFIX.length).trim().split(/ +/)

    //command is the command function inside of the map
    const command = client.commands.get(commandName.toLowerCase());
    if (!command) {
        await message.author.send({
            content: 'Invalid command, use `?help` to see available commands.'
        })
        await message.delete()
        return;
    }
    //string the args together following the command
    const input = args.join(' ');
    try {
        await command.execute(message, args, input);
    } catch (err) {
        console.log(err);
        message.reply({
            content: 'There was an error executing that command.',
     })
     message.delete()
    }

})

client.login(token)
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(3000, () => console.log('Web server running.'));