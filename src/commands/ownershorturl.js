const { MessageEmbed } = require('discord.js')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports.run = async (client,message,args) => {
    if(!global.config.bot.owners.includes(message.author.id)) return  message.reply('<:no:833101993668771842> Only The Owner Of SnowBots Can Use This Bypass <:no:833101993668771842>')
     if(!args[0]) return message.channel.send("Error: Please give us a url to shorten.");
   const url = args.join(" ");

    const data = await fetch(
      `https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`
    ).then((res) => res.json());

    const embed = new MessageEmbed()
     .setAuthor(`${message.author.username}`)
      .setDescription('**[URL](https://en.wikipedia.org/wiki/URL) Shortened!**')
      .addFields(

  { name: `Original URL`, value: `${url}` ,inline: true },

  { name: `Shortened URL`, value: `${data.shorturl}` ,inline: false }

)
.setTimestamp()
.setColor("#FF0000")
    message.channel.send(embed);
};
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
  };
  
  exports.help = {
    name: "ownershorturl",
    description: "",
    usage: ""
  };