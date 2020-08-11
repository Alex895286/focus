const Discord = require('discord.js');
const database = require('../database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
const logchannels = new Keyv(database.logchannels);
module.exports = {
    name: 'giverole',
    description: `Adds a role to a user.`,
    usage: 'giverole @`member` `role`',
    guildOnly: true,
    async execute(message, args) {
        let prefix = await prefixes.get(`${message.guild.id}`);
        if (!prefix)
            prefix = '/';
        let member = message.mentions.members.first();
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
            message.channel.send('I need the Manage Roles permission in order to execute this command.');
            return message.react('❌');
        }
        if (!args[1]) {
            message.channel.send(`Proper command usage: ${prefix}giverole @[member] [role]`);
            return message.react('❌');
        }
        args.shift();
        let rolename = args.join(' ');
        let role = message.guild.roles.cache.find(role => role.name === `${rolename}`);
        if (!role) {
            message.channel.send(`Couldn't find any roles named ${rolename}`);
            return message.react('❌');
        }
        if (member.roles.cache.has(role.id)) {
            message.channel.send(`${member.user.username} already has that role.`);
            return message.react('❌');
        }
        let bothighestrole = -1;
        message.guild.me.roles.cache.map(r => {
            if (r.position > bothighestrole)
                bothighestrole = r.position;
        })
        if (role.position >= bothighestrole) {
            message.channel.send('My roles must be higher than the role that you want to give!');
            return message.react('❌');
        }
        if (!message.member.hasPermission('MANAGE_ROLES') || !message.guild.member(member).kickable) {
            message.channel.send('You need the Manage Roles permission in order to run this command. In case you have it, make sure that my role is higher than the role of the member you want to give a role to!');
            return message.react('❌');
        }
        let highestrole = -1;
        message.member.roles.cache.map(r => {
            if (r.position > highestrole)
                highestrole = r.position;
        });
        if (role.position >= highestrole) {
            message.channel.send('Your roles must be higher than the role that you want to give. In case they are, make sure that my role is higher than the role of the member you want to give a role to!');
            return message.react('❌');
        }
        member.roles.add(role);
        let perms = role.permissions.toArray().map(perm => perm).join(`\n`);
        perms = '```' + perms + '```';
        let giveroleembed = new Discord.MessageEmbed()
            .setColor('#00ffbb')
            .setTitle(`${message.client.emojis.cache.find(emoji => emoji.name === 'pinned')} Given Role`)
            .addFields(
                { name: 'To', value: `${member}` },
                { name: 'By', value: `${message.author.username}` },
                { name: 'Role', value: `${rolename}` },
                { name: 'Permissions', value: `${perms}` }
            )
            .setTimestamp();
        message.react('✔️');
        let logchname = await logchannels.get(`logchannel_${message.guild.id}`);
        let log = message.guild.channels.cache.find(ch => ch.name === `${logchname}`);
        if (log)
            log.send(giveroleembed);
        else
            message.channel.send(giveroleembed);
    }
}