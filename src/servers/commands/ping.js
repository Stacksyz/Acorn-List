const Discord = require('discord.js')
const client = new Discord.Client();
const fs = require('fs');
const vcodes = require("vcodes.js");

module.exports.run = async (client, message, args) => {
  const embedsearch = new Discord.MessageEmbed()
   .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
   .setDescription(`<:search:876255860614115358> *Searching Ping*`)
   .setColor("#7289da")
   .setFooter(`It might take a while bcz im finding my Uptime`)
   editthis = await message.channel.send(embedsearch)
   await sleep(3000)
   await editthis.delete()
  let totalSeconds = (client.uptime / 1000);
  let days = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = Math.floor(totalSeconds % 60);
  let uptime = `**${days}** days, **${hours}** hours, **${minutes}** minutes and **${seconds}** seconds`;
  const embedPing = new Discord.MessageEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
    .setDescription("**Uptime:** " + uptime + " \n**Bot Latency:** ``" + Math.floor(Date.now() - message.createdTimestamp) + " ms``\n**API Latency:** ``" + Math.round(message.client.ws.ping) + " ms``")
    .setColor("#206694")
  await message.channel.send(embedPing)

};
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
};

exports.help = {
  name: "ping",
  description: "",
  usage: ""
};