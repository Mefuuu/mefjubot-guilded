require("dotenv/config");
const { Collection } = require("@discordjs/collection");
const { readdir } = require("fs/promises");
const { join } = require("path");
const { Client } = require("guilded.js");

const config = require('../config.json');
const fs = require('node:fs');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const client = new Client({ token: process.env.TOKEN });
const prefix = process.env.PREFIX;
const commands = new Collection();

client.on("messageCreated", async (msg) => {
    if (!msg.content.startsWith(prefix)) return;
    let [commandName, ...args] = msg.content.slice(prefix.length).trim().split(/ +/);
    commandName = commandName.toLowerCase();

    const command = commands.get(commandName) ?? commands.find((x) => x.aliases?.includes(commandName));
    if (!command) return;

    try {
        await command.execute(msg, args);
    } catch (e) {
        void client.messages.send(msg.channelId, "There was an error executing that command!");
        void console.error(e);
    }
});

// client.on("debug", console.log);
client.on("error", console.log);
client.on("ready", async () => {
    console.log("Guilded bot is ready!");
    const forum = await client.channels.fetch('02e70088-254b-4390-a178-42cada05ed2f');
    setInterval (async function () {
        const freegames = await fetch('https://api.reddit.com/r/GameDealsFree/').then(res => res.json());
        const index = freegames.data.children.findIndex(e => e.data.id === config.freeGamesId);
        if (index === 0) return;
        for (i = index - 1; i >= 0; i--) {
            let game = freegames.data.children[i].data;
            await forum.createTopic(game.title, game.url);
        }
        config.freeGamesId = freegames.data.children[0].data.id;
        fs.writeFileSync('./config.json', JSON.stringify(config));
    }, 600000);
});
client.on("exit", () => console.log("Disconnected!"));

void (async () => {
    const commandDir = await readdir(join(__dirname, "commands"), { withFileTypes: true });

    for (const file of commandDir.filter((x) => x.name.endsWith(".js"))) {
        const command = require(join(__dirname, "commands", file.name));
        commands.set(command.name, command);
    }

    client.login();
})();
