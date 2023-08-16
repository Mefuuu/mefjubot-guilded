const { Embed } = require('guilded.js');
const config = require('../../config.json');

module.exports = {
    aliases: ["help"],
    execute: async (msg) => {
        const settings = config.serverDatas.find(e => e.id === msg.serverId);
        const channel = settings ? await msg.client.channels.fetch(settings.channel) : '';
        const server = settings ? await msg.client.servers.fetch(settings.id) : '';
        const status = settings ? `Notifications are active!\nChannel: [#${channel.name}](https://guilded.gg/${server.shortURL}/groups/${channel.groupId}/channels/${settings.channel}/chat)` : 'Notifications are inactive!'
        const e = new Embed({
            color: '#00FFFF',
            description: `Hello! I'm here to let you know if any game will be free!`,
            fields: [
                { name: 'Setup:', value: `- Turning on notifications:\n\`.on <text channel id>\`\n- Turning off notifications:\n\`.off\``, inline: true },
                { name: 'Status:', value: status, inline: true }
            ],
            footer: { text: 'For more help join my support server!', icon_url: msg.client.user.avatar }
        });
        msg.reply({ embeds: [e] });
    },
    name: "help",
};
