const Discord = require('discord.js')
const vcodes = require("vcodes.js");
const botdata = require("../database/models/botlist/bots.js")
module.exports.run = async (client,message,args) => {
  let x = await botdata.find();
  let bots = await x.filter(a => a.ownerID == message.author.id || a.coowners.includes(message.author.id))
   const embed = new Discord.MessageEmbed()
   .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
   .setDescription(`<:Thinking:866089513997959178> **[Acorn Information](https://list.acorn.ink)**
    <:Thinking:866089513997959178>
    \nAcorn is a Bot And Server List originally developed by [Acorn.ink](https://list.acorn.ink/)
    \n\nAbout Me:\n**Stacksyz is my developer, he has created Acorn with all its cmds!
    \n\nMy Links:
    \nInvite me [here](https://list.acorn.ink/)\nVisit my [uptimer web](https://uptimer.acorn.ink/)
    \nVisit [Acorn Bot List!](https://list.acorn.ink)\n\nMade with :heart: by Stacksyz.**`)
   .setColor("#7289da")
   .setThumbnail('https://cdn.discordapp.com/attachments/860628976572563507/870721630106681404/standard_5.gif')
   .setFooter('Made with ❤️')
   message.channel.send(embed)
};
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["info"],
  };
  
  exports.help = {
    name: "faq",
    description: "",
    usage: ""
  };