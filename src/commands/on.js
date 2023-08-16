const config = require('../../config.json');
const fs = require('node:fs');

module.exports = {
    aliases: ["on"],
    execute: async (msg, args) => {
        if (!msg.member.isOwner) return msg.reply('For now, only server owner can use this command!');
        if (config.serverDatas.find(e => e.id === msg.serverId)) return msg.reply('You already have this option enabled.\nTo turn me off type: `.off`');
        let errmsg = `You have to paste __text__ channel id!\nFor example:\n.on 902ca08d-0e51-4bb6-bd98-fcdf0cc02c45`;
        if (!args[0]) return await msg.reply(errmsg);
        else if (args[0]) {
            try {
                const channel = await msg.client.channels.fetch(args[0]);
                if (channel.type != 1) return msg.reply(errmsg);
                config.serverDatas.push({ id: msg.serverId, channel: args[0] });
                await msg.addReaction('2012870');
                fs.writeFileSync('./config.json', JSON.stringify(config));
            }
            catch (err) {
                console.log(err);
                if (err) return msg.reply(errmsg);
            }
        }
    },
    name: "on",
};
