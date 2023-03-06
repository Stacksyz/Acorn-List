const Discord = require('discord.js');
module.exports.run = async (client,message,args) => {
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("❌**Error:** You don't have the **Manage Messages** permission!");
    if (!args[0]) return message.reply("Please enter a number.");
    if (isNaN(args[0])) return message.reply(`${args[0]} is not a valid number.`);
    if (args[0] > -1){message.channel.setRateLimitPerUser(args[0])
    message.channel.send(new Discord.MessageEmbed().setDescription(`Slowmode is now ${args[0]}s.`).setColor("RANDOM"))}

  }
exports.conf = {

	enabled: true,
	guildOnly: false,
	aliases: ["sm"]
};
exports.help = {
	name: 'slowmode',
	description: 'Sets channel slowmode',
	usage: 'say'
};