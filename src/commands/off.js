const config = require('../../config.json');
const fs = require('node:fs');

module.exports = {
    aliases: ["off"],
    execute: async (msg) => {
        if (!msg.member.isOwner) return msg.reply('For now, only server owner can use this command!');
        if (!config.serverDatas.find(e => e.id === msg.serverId)) return msg.reply('You don\'t have notifications enabled.\nTo turn me on type: `.on <text channel id>`');
        const index = config.serverDatas.findIndex(e => e.id === msg.serverId);
        config.serverDatas.splice(index, 1);
        await msg.addReaction('2012870');
        fs.writeFileSync('./config.json', JSON.stringify(config));
    },
    name: "off",
};
