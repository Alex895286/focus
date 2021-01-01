const Discord = require('discord.js');
const Keyv = require('keyv');
const rolePickers = new Keyv(process.env.rolePickers);
const { deletionTimeout } = require('../../config.json');

module.exports = {
  name: 'rolepicker',
  description: 'Creates a menu that automatically assigns roles to users that react to it.',
  usage: 'rolepicker @`role` emoji @`role` emoji @`role` emoji etc. (maximum 25)',
  requiredPerms: 'MANAGE_GUILD',
  permError: 'You require the Manage Server permission in order to run this command.',
  async execute(message, args, prefix) {
    let roles = [];
    let emojis = [];
    let err = 0;
    let emoji;
    args.forEach(async (arg) => {
      if (args.indexOf(arg) % 2 == 0 && arg.startsWith('<@&') && arg.endsWith('>') && arg.length == 22) {
        let role = message.guild.roles.cache.get(arg.substring(3, 21));
        if (message.guild.me.roles.highest.comparePositionTo(role) <= 0) {
          err = 1;
          let msg = await message.channel.send(`Error at role ${'`' + role.name + '`'}. My roles must be higher than the role that you want to set.`);
          return msg.delete({ timeout: deletionTimeout });
        }

        if (message.member.roles.highest.comparePositionTo(role) <= 0) {
          err = 1;
          let msg = await message.channel.send(`Error at role ${'`' + role.name + '`'}. Your roles must be higher than the role that you want to set.`);
          return msg.delete({ timeout: deletionTimeout });
        }

        roles.push(role);
      }

      if (args.indexOf(arg) % 2 == 1 && !arg.startsWith('<@&')) {
        if (arg.startsWith('<:')) {
          let customEmoji = message.client.emojis.cache.get(arg.slice(-19, -1));
          if (!customEmoji) {
            let msg = await message.channel.send(`Error at emoji ${arg}. Make sure that this emoji shares a mutual server with me!`);
            return msg.delete({ timeout: deletionTimeout });
          }

          emoji = arg.slice(-19, -1);
        } else emoji = arg;

        emojis.push(emoji);
      }
    });

    if (err == 1)
      return;

    if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
      let msg = await message.channel.send('I require the Manage Roles permission in order to execute this command.');
      return msg.delete({ timeout: deletionTimeout });
    }

    if (!args[1] || roles.length != args.length / 2 || emojis.length != args.length / 2 || args.length > 50) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}rolepicker @[role] emoji @[role] emoji @[role] emoji etc. (maximum 25)`);
      return msg.delete({ timeout: deletionTimeout });
    }

    let mappings = new Map();
    let rolePicker = new Discord.MessageEmbed()
      .setColor('#00ffbb')
      .setTitle('Role Picker')
      .setDescription('React to assign yourself a role!')
      .setTimestamp();
    let i = 0;
    roles.forEach((role) => {
      rolePicker.addField(role.name, message.client.emojis.cache.get(emojis[i]) || emojis[i]);
      mappings.set(emojis[i], role.id);
      i++;
    });

    let menu = await message.channel.send(rolePicker);
    emojis.forEach((emoji) => menu.react(emoji));

    message.delete();
    const object = Object.fromEntries(mappings);
    await rolePickers.set(menu.id, object);
  }
}