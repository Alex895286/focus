const Discord = require('discord.js');
const database = require('../database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
const warnings = new Keyv(database.warnings);
const logchannels = new Keyv(database.logchannels);
module.exports = {
    name: 'warn',
    description: `Sends a warning message to a user.`,
    usage: 'warn @`user` `reason`',
    guildOnly: true,
    async execute(message, args) {
        let prefix = await prefixes.get(message.guild.id);
        if (!prefix)
            prefix = '/';
        let member = message.mentions.users.first();
        let author = message.author.username;
        let reason = [];
        for (i = 1; i < args.length; i++)
            reason = reason + args[i] + ' ';
        if (!member || !args[1])
            message.channel.send(`Proper command usage: ${prefix}warn @[user] [reason]`);
        else
            if (!message.member.hasPermission('KICK_MEMBERS'))
                message.channel.send('You need the Kick Members permission in order to run this command.');
            else {
                if (member.id == message.author.id)
                    return message.channel.send(`You can't warn youself, smarty pants!`);
                let warns = await warnings.get(`warns_${member.id}_${message.guild.id}`);
                if (!warns)
                    warns = 1;
                else
                    warns = warns + 1;
                const warnembed = new Discord.MessageEmbed()
                    .setColor('#00ffbb')
                    .setTitle(`${message.client.emojis.cache.find(emoji => emoji.name === 'pinned')} Warn Information`)
                    .addFields(
                        { name: `Defendant's name:`, value: `${member}` },
                        { name: `Issued by:`, value: `${author}` },
                        { name: 'Reason:', value: `${reason}` }
                    )
                    .setTimestamp();
                let logchname = await logchannels.get(`logchannel_${message.guild.id}`);
                let log = message.guild.channels.cache.find(ch => ch.name === `${logchname}`);
                if (!log)
                    message.channel.send(warnembed);
                else
                    log.send(warnembed);
                member.send(`${author} is warning you in ${message.guild.name} for ${reason}.`);
                await warnings.set(`warns_${member.id}_${message.guild.id}`, warns);
            }
    }
}