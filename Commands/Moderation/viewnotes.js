const Discord =require('discord.js');
const Keyv = require('keyv');
const nts = new Keyv(process.env.notes);
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');

module.exports = {
  name: 'viewnotes',
  description: `Views all notes linked to an account.`,
  usage: 'viewnotes @`user`',
  requiredPerms: 'KICK_MEMBERS',
  permError: 'You require the Kick Members permission in order to run this command.',
  async execute(message, args, prefix) {
    const member = message.mentions.members.first();
    if (!member || !args[1]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}viewnotes @[user]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    const notes = await nts.get(`notes_${member.id}_${message.guild.id}`);
    let content = '';
    notes.forEach((note) => content += note);
    await message.channel.send('Check your inbox.');
    if (!notes[0]) message.author.send(`There are no notes linked to ${member.user.username}.`);
    else {
      const viewNotesEmbed = new Discord.MessageEmbed()
        .setColor('#00ffbb')
        .setTitle(`${member.user.username}'s notes`)
        .setDescription(content)
        .setTimestamp();
      message.author.send(viewNotesEmbed);
    }
    message.react(reactionSuccess);
  }
}