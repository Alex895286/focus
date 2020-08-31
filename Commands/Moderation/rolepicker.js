const Discord = require("discord.js");

module.exports = {
    name: 'rolepicker',
    description: 'Creates a menu that automatically assigns roles to users that react to it.',
    usage: 'rolepicker @`role` emoji @`role` emoji @`role` emoji etc. (maximum 25)',
    guildOnly: true,
    async execute(message, args, prefix) {
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
            let msg = await message.channel.send('I require the Manage Roles permission in order to execute this command.');
            msg.delete({ timeout: 10000 });
            return message.react('❌');
        }
        if (!args[1] || args.length > 25) {
            let msg = await message.channel.send(`Proper command usage: ${prefix}rolepicker @[role] emoji @[role] emoji @[role] emoji etc. (maximum 25)`);
            msg.delete({ timeout: 10000 });
            return message.react('❌');
        }
        if (!message.member.hasPermission('MANAGE_GUILD')) {
            let msg = await message.chanel.send('You require the Manage Server permission in order to run this command!');
            msg.delete({ timeout: 10000 });
            return message.react('❌');
        }
        let roles = message.mentions.roles;
        let emojis = [];
        args.forEach(async arg => {
            if (args.indexOf(arg) % 2 == 1) {
                emojis.push(arg);
            }
        });
        let rolepicker = new Discord.MessageEmbed()
            .setTitle('Role Picker')
            .setDescription('React to assign yourself a role!')
            .setTimestamp();
        let i = 0;
        roles.forEach(role => {
            console.log(role.name + '\n' +  emojis[i]);
            rolepicker.addField({ name: role.name, value: emojis[i] });
            i++;
        });
        let menu = await message.channel.send(rolepicker);
        emojis.forEach(emoji => {
            menu.react(emoji);
        });
    }
}