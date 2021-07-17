const Discord = require('discord.js');
const Keyv = require('keyv');
const suggestionChannels = new Keyv(process.env.suggestionChannels);
const logChannels = new Keyv(process.env.logChannels);
const msgLogs = new Keyv(process.env.msgLogs);
const welcomeChannels = new Keyv(process.env.welcomeChannels);
const leaveChannels = new Keyv(process.env.leaveChannels);
const welcomeMessages = new Keyv(process.env.welcomeMessages);
const welcomeDms = new Keyv(process.env.welcomeDms);
const welcomeRoles = new Keyv(process.env.welcomeRoles)
const leaveMessages = new Keyv(process.env.leaveMessages);
const toggleWelcomeMsg = new Keyv(process.env.toggleWelcomeMsg);
const toggleWelcomeDm = new Keyv(process.env.toggleWelcomeDm);
const toggleLeaveMsg = new Keyv(process.env.toggleLeaveMsg);
const { reactionSuccess, deafultWelcomeMsg, defaultLeaveMsg } = require('../../config.json');
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = {
  name: 'serversettings',
  description: 'Sends current bot settings for this server.',
  usage: 'serversettings',
  requiredPerms: 'KICK_MEMBERS',
  permError: 'You require the Kick Members permission in order to run this command.',
  async execute(message, args, prefix) {
    let suggestionChannel = await suggestionChannels.get(message.guild.id);
    if(!suggestionChannel) suggestionChannel = 'N/A';

    let logChannel = await logChannels.get(`logchannel_${message.guild.id}`);
    if (!logChannel) logChannel = 'N/A';

    let logChannelState = await msgLogs.get(`msglogs_${message.guild.id}`);
    if (logChannelState == 1) logChannelState = 'enabled';
    else logChannelState = 'disabled';

    let welcomeChannel = await welcomeChannels.get(`welcomechannel_${message.guild.id}`);
    if (!welcomeChannel) welcomeChannel = 'N/A';

    let leaveChannel = await leaveChannels.get(`leavechannel_${message.guild.id}`);
    if (!leaveChannel) leaveChannel = 'N/A';

    let welcomeMessage = await welcomeMessages.get(`welcomemessage_${message.guild.id}`);
    if (!welcomeMessage) welcomeMessage = deafultWelcomeMsg;

    let welcomeRole = await welcomeRoles.get(`welcomerole_${message.guild.id}`);
    if(!welcomeRole) welcomeRole = 'N/A';

    let leaveMessage = await leaveMessages.get(`leavemessage_${message.guild.id}`);
    if (!leaveMessage) leaveMessage = defaultLeaveMsg;

    let welcomeDm = await welcomeDms.get(`welocmedm_${message.guild.id}`);
    if (!welcomeDm) welcomeDm = 'N/A';

    let welcomeMessageState = await toggleWelcomeMsg.get(`togglewelcomemsg_${message.guild.id}`);
    if (welcomeMessageState == 1) welcomeMessageState = 'enabled';
    else welcomeMessageState = 'disabled';

    let welcomeDmState = await toggleWelcomeDm.get(`togglewelcomedm_${message.guild.id}`);
    if (welcomeDmState == 1) welcomeDmState = 'enabled';
    else welcomeDmState = 'disabled';

    let leaveMessageState = await toggleLeaveMsg.get(`toggleleavemsg_${message.guild.id}`);
    if (leaveMessageState == 1) leaveMessageState = 'enabled';
    else leaveMessageState = 'disabled';

    let color = getRoleColor(message.guild);
    const botSettingsEmbed = new Discord.MessageEmbed()
      .setColor(color)
      .setTitle(`Server settings for ${message.guild.name}`)
      .addFields(
        { name: 'Prefix', value: '```' + prefix + '```', inline: true },
        { name: 'Suggestion Channel', value: '```' + suggestionChannel + '```', inline: true },
        { name: 'Log Channel', value: '```' + `${logChannel} [${logChannelState}]` + '```', inline: true },
        { name: 'Welcome Channel', value: '```' + welcomeChannel + '```', inline: true },
        { name: 'Welcome Message', value: '```' + `${welcomeMessage} [${welcomeMessageState}]` + '```', inline: true },
        { name: 'Welcome DM', value: '```' + `${welcomeDm} [${welcomeDmState}]` + '```', inline: true },
        { name: 'Welcome Role', value: '```' + welcomeRole + '```', inline: true },
        { name: 'Leave Channel', value: '```' + leaveChannel + '```', inline: true },
        { name: 'Leave Message', value: '```' + `${leaveMessage} [${leaveMessageState}]` + '```', inline: true }
      )
      .setTimestamp();
    await message.channel.send(botSettingsEmbed);
    message.react(reactionSuccess);
  }
}