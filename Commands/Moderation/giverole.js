const Discord = require('discord.js');
const { deletionTimeout, reactionError, reactionSuccess, pinEmojiId } = require('../../config.json');
const { getRoleColor } = require('../../Utils/getRoleColor');
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  name: 'giverole',
  description: `Adds a role to a user.`,
  usage: 'giverole @`member` `role`',
  requiredPerms: ['MANAGE_ROLES'],
  botRequiredPerms: ['MANAGE_ROLES'],
  async execute(message, args, prefix) {
    const member = message.mentions.members.first();
    if (!args[1]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}giverole @[member] [role]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    if (!member) {
      let msg = await message.channel.send(`Couldn't find ${args[0]}`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    args.shift();
    const roleName = args.join(' ').toLowerCase();
    const role = message.guild.roles.cache.find((role) => role.name.toLowerCase().startsWith(roleName));

    if (!role) {
      let msg = await message.channel.send(`Couldn't find any roles named ${roleName}`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    if (member.roles.cache.has(role.id)) {
      let msg = await message.channel.send(`${member.user.username} already has that role.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    if (message.guild.me.roles.highest.comparePositionTo(role) <= 0) {
      let msg = await message.channel.send('My roles must be higher than the role that you want to give!');
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }
    
    if (message.member.roles.highest.comparePositionTo(role) <= 0) {
      let msg = await message.channel.send('Your roles must be higher than the role that you want to give!');
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    member.roles.add(role);
    let perms = role.permissions.toArray().map((perm) => perm).join(`\n`);
    perms = '```' + perms + '```';
    let color = getRoleColor(message.guild);
    const giveRoleEmbed = new Discord.MessageEmbed()
      .setColor(color)
      .setTitle(`${message.client.emojis.cache.get(pinEmojiId).toString()} Given Role`)
      .addFields(
        { name: 'To', value: `${member}` },
        { name: 'By', value: `${message.author.username}` },
        { name: 'Role', value: `${role.name}` },
        { name: 'Permissions', value: `${perms}` }
      )
      .setTimestamp();
    await sendLog(message.guild, message.channel, giveRoleEmbed);
    message.react(reactionSuccess);
  }
}