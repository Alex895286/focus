const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
  name: 'serverinfo',
  description: `Displays information about the server you're in.`,
  usage: 'serverinfo',
  execute(message) {
    let color;
    if (message.guild.me.roles.highest.color === 0) color = '#b9bbbe';
    else color = message.guild.me.roles.highest.color;
    const serverInfoEmbed = new Discord.MessageEmbed()
      .setColor(color)
      .setTitle('Server Information')
      .addFields(
        { name: 'Server Name', value: `${message.guild.name}` },
        { name: 'Server ID', value: `${message.guild.id}` },
        { name: 'Total Members', value: `${message.guild.memberCount}` },
        { name: 'Owner', value: `${message.guild.owner}` },
        { name: 'Created At', value: `${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} (${moment(message.guild.createdTimestamp).fromNow()})` },
        { name: 'Role Count', value: `${message.guild.roles.cache.size}` },
        { name: 'Channel Count', value: `${message.guild.channels.cache.size}` },
        { name: 'Custom Emoji Count', value: `${message.guild.emojis.cache.size}` },
        { name: 'Boost Count', value: `${message.guild.premiumSubscriptionCount || '0'}` }
      )
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setTimestamp();
    message.channel.send(serverInfoEmbed);
  }
}