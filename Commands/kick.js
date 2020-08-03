const Discord = require('discord.js');
const database = require('../database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
const kks = new Keyv(database.kks);
const logchannels = new Keyv(database.logchannels);
module.exports = {
    name: 'kick',
    description: `Kicks a certain user out of the server.`,
    usage: 'kick @`user` `reason`',
    guildOnly: true,
    async execute(message, args) {
        let prefix = await prefixes.get(message.guild.id);
        if (!prefix)
            prefix = '/';
        let member = message.mentions.members.first();
        let reason = [];
        for (let i = 1; i < args.length; i++)
            reason = reason + args[i] + ' ';
        if (!message.guild.me.hasPermission('KICK_MEMBERS'))
            return message.channel.send('I require the `Kick Members` permission in order to perform this action.');
        if (!member || !args[1])
            message.channel.send(`Proper command usage: ${prefix}kick @[user] [reason]`);
        else
            if (!message.member.hasPermission('KICK_MEMBERS') || !message.guild.member(member).kickable)
                message.channel.send(`It appears that you lack permissions to kick. In case you have them, make sure that my role is higher than the role of the person you want to kick!`);
            else {
                if (member.id == message.author.id)
                    return message.channel.send(`I mean you could simply leave the server.`);
                let author = message.author.username;
                let kicks = await kks.get(`kicks_${member.id}_${message.guild.id}`)
                if (!kicks)
                    kicks = 1;
                else
                    kicks = kicks + 1;
                const kickembed = new Discord.MessageEmbed()
                    .setColor('#00ffbb')
                    .setTitle(`${message.client.emojis.cache.find(emoji => emoji.name === 'pinned')} Kick Information`)
                    .addFields(
                        { name: `Defendant's name:`, value: `${member}` },
                        { name: `Issued by:`, value: `${author}` },
                        { name: `Reason:`, value: `${reason}` },
                    )
                    .setTimestamp();
                let logchname = await logchannels.get(`logchannel_${message.guild.id}`);
                let log = message.guild.channels.cache.find(ch => ch.name === `${logchname}`);
                if (!log)
                    await message.channel.send(kickembed);
                else
                    await log.send(kickembed);
                await member.send(`${author} kicked you from ${message.guild.name} for ${reason}.`);
                await kks.set(`kicks_${member.id}_${message.guild.id}`, kicks);
                message.guild.member(member).kick();
            }
    }
}