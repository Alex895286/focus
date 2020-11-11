const Keyv = require('keyv');
const nts = new Keyv(process.env.notes);
const { deletionTimeout } = require('../../config.json');
const moment = require('moment');

module.exports = {
  name: 'editnote',
  description: 'Edits a note from a user.',
  usage: 'editnote @`user` `noteID` `new content`',
  requiredPerms: 'KICK_MEMBERS',
  permError: 'You require the Kick Members permission in order to run this command.',
  async execute(message, args, prefix) {
    const member = message.mentions.members.first();
    if (!args[2] || !member || isNaN(args[1])) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}editnote @[user] [noteID] [new content]`);
      return msg.delete({ timeout: deletionTimeout });
    }

    let notes = await nts.get(`notes_${member.id}_${message.guild.id}`);

    if (parseInt(args[1]) > notes.length || parseInt(args[1]) < 1) {
      await message.author.send(`Couldn't find any notes with the ID of ${args[1]}`);
      return message.delete();
    }

    const index = parseInt(args[1] - 1);
    args.shift();
    args.shift();
    notes[index] = '```' + `${args.join(' ')}` + '```' + `Added by ${message.author.username} on ${moment(message.createdTimestamp).format('LL')}, at ${moment(message.createdTimestamp).format('LT')} GMT\n`;
    await nts.set(`notes_${member.id}_${message.guild.id}`, notes);
    await message.author.send(`Note successfully edited on ${member.user.username}'s account.`);
    message.delete();
  }
}