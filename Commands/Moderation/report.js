const Discord = require('discord.js');
const Keyv = require('keyv');
const logChannels = new Keyv(process.env.logChannels);

module.exports = {
  name: 'report',
  description: `Submits a report to the staff's logs channel.`,
  usage: 'report `username` `offense`',
  guildOnly: true,
  async execute(message, args, prefix) {
    const member = message.guild.members.cache.find((user) => user.user.username === `${args[0]}` || user.nickname === `${args[0]}`) || message.mentions.members.first();
    if (!member) {
      let msg = await message.channel.send(`Couldn't find ${args[0]}`);
      return msg.delete({ timeout: 10000 });
    }

    if (!args[1]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}report [username] [offense]`);
      return msg.delete({ timeout: 10000 });
    }

    const logChName = await logChannels.get(`logchannel_${message.guild.id}`);
    const log = message.guild.channels.cache.find((ch) => ch.name === `${logChName}`);
    
    if (!log) {
      let msg = await message.channel.send(`Looks like the server doesn't have any logs channel. Please ask a staff member to setup one using ${prefix}setlogschannel`);
      return msg.delete({ timeout: 10000 });
    }

    args.shift();
    const report = args.join(' ');
    const reportEmbed = new Discord.MessageEmbed()
      .setColor('#00ffbb')
      .setTitle(`${message.client.emojis.cache.find((emoji) => emoji.name === 'pinned')} New Report`)
      .addFields(
        { name: 'Submitted by:', value: `${message.author.username}` },
        { name: 'Defendant:', value: `${member}` },
        { name: 'Offense', value: `${report}` }
      )
      .setTimestamp();
    await log.send(reportEmbed);
    await message.author.send(`${member} has been successfully reported to the server's staff.`);
    message.channel.bulkDelete(1);
  }
}