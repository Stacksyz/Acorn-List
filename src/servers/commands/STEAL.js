const { Client, Message, Util } = require("discord.js");
const Discord = require("discord.js");

module.exports.run = async (client,message,args) => {
   if (!message.member.hasPermission("MANAGE_EMOJIS")) return message.reply("❌**Error:** You don't have the **Manage Emojis** permission!");
  if (!args.length) return message.channel.send(new Discord.MessageEmbed()
  .setTitle(`Give me an emoji to steal`).setDescription("<:no:833101993668771842> Please specify an emoji for me to steal <:no:833101993668771842>"));

  for (const rawEmoji of args) {
    const parsedEmoji = Util.parseEmoji(rawEmoji);

    if (parsedEmoji.id) {

      const extension = parsedEmoji.animated ? ".gif" : ".png";
      const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + extension}`;
      message.guild.emojis
      .create(url, parsedEmoji.name)
      .then((emoji) => message.channel.send(new Discord.MessageEmbed().setTitle(`<:check:870019748585414686> I have added the emoji! <:check:870019748585414686>`).setDescription(`Thanks for using me!`).setThumbnail(`${emoji.url}`)));
    }
  }
},
    exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
  };
  
  exports.help = {
    name: "steal",
    description: "",
    usage: ""
  };