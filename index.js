require('dotenv').config();
const token = process.env.DISCORD_TOKEN;
const  {Client, GatewayIntentBits, Collection }= require('discord.js')
const fs = require('fs')
const path = require('path')


const client = new Client({
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})
client.commands = new Collection();

const commandsPath = path.join(__dirname,'commands')
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on("messageCreate", (msg)=>{
    if(msg.content === 'ping'){
        msg.reply('pong')
    }
})

client.login(token)