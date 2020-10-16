import moment from 'moment';
import Keyv from 'keyv';
const nts = new Keyv(process.env.notes);
import { deletionTimeout } from '../../config.json';

module.exports = {
  name: 'addnote',
  description: `Adds an admin note on someone's account. All staff members will be able to view this note.`,
  usage: 'addnote `username` `note`',
  requiredPerms: 'KICK_MEMBERS',
  permError: 'You require the Kick Members permission in order to run this command.',
  async execute(message, args, prefix) {
    if (!args[1]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}addnote [username] [note]`);
      return msg.delete({ timeout: deletionTimeout });
    }

    const member = message.guild.members.cache.find((user) => user.user.username === `${args[0]}` || user.nickname === `${args[0]}`) || message.mentions.members.first();
    
    if (!member) {
      await message.author.send(`Couldn't find ${args[0]}.`);
      return message.delete();
    }

    args.shift();
    const note = '```' + args.join(' ') + '```';
    let notes = await nts.get(`notes_${member.id}_${message.guild.id}`);
    if (!notes) notes = note + `Added by ${message.author.username} on ${moment(message.createdTimestamp).format('LL')}, at ${moment(message.createdTimestamp).format('LT')} GMT\n`;
    else notes = notes + note + `Added by ${message.author.username} on ${moment(message.createdTimestamp).format('LL')}, at ${moment(message.createdTimestamp).format('LT')} GMT\n`;
    await nts.set(`notes_${member.id}_${message.guild.id}`, notes);
    await message.author.send(`Note successfully added on ${member.user.username}'s account`);
    message.delete();
  }
}