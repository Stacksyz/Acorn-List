const Discord = require('discord.js');
const vcodes = require("vcodes.js");
const { MessageButton, MessageActionRow } = require('discord-buttons');
const botdata = require("../database/models/botlist/bots.js")
module.exports.run = async (client,message,args) => {
  let x = await botdata.find();
  let bots = await x.filter(a => a.ownerID == message.author.id || a.coowners.includes(message.author.id))
   const embed = new Discord.MessageEmbed()
   .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
   .setDescription(`<a:yes:833101995723194437> **[Acorn Add bot](https://list.acorn.ink)** <a:yes:833101995723194437>\n\nyou can add your bot [here](https://list.acorn.ink/addbot)`)
   .setColor("#7289da")
   .setFooter('Powered by Acorn.ink')
      let button = new MessageButton()
  .setStyle('url')
  .setURL('https://list.acorn.ink/addbot') 
  .setLabel('Add your bot')
    .setEmoji('870019597791805521');


let row = new MessageActionRow()
  .addComponents(button);
return message.channel.send({ embed: embed, buttons: [ button ] 
});
   
   message.channel.send(embed)
};
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
  };
  
  exports.help = {
    name: "addbot",
    description: "",
    usage: ""
  };
  