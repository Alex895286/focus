const Discord = require("discord.js");
const database = require('../database.json');
const Keyv = require('keyv');
const logchannels = new Keyv(database.logchannels);
module.exports = {
    name: 'clear',
    description: 'Bulk deletes a certain amount of messages.',
    usage: 'clear `amount`',
    guildOnly: true,
    async execute(message, args) {
        if (!message.guild.me.hasPermission('MANAGE_MESSAGES'))
            return message.channel.send('I require the `Manage Messages` permission in order to perform this action!');
        if (!message.member.hasPermission('MANAGE_MESSAGES'))
            message.channel.send(`It appears that you don't have permission to clear messages.`);
        else {
            const amount = parseInt(args[0]) + 1;
            if (isNaN(amount) || amount < 2 || amount > 100)
                message.channel.send(`You must enter a number higher than 0 and less than 100.`);
            else {
                message.channel.bulkDelete(amount, true).catch(err => {
                    console.error(err);
                    return message.channel.send(`Can't delete messages older than 2 weeks.`);
                });
                let clearembed = new Discord.MessageEmbed()
                    .setColor('#00ffbb')
                    .setTitle('Cleared Messages')
                    .addFields(
                        { name: 'Cleared by:', value: `${message.author.username}` },
                        { name: 'Amount of Messages Deleted:', value: `${amount}` },
                        { name: 'Channel:', value: `${message.channel.name}` }
                    )
                    .setTimestamp();
                let logchname = await logchannels.get(`logchannel_${message.guild.id}`);
                let log = message.guild.channels.cache.find(ch => ch.name === `${logchname}`);
                if (!log)
                    message.channel.send(clearembed);
                else
                    log.send(clearembed);
            }
        }
    }
}