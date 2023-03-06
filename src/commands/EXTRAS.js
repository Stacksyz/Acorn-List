const Discord = require('discord.js')
const vcodes = require("disbots.js");
const { MessageButton, MessageActionRow } = require('discord-buttons');
const botdata = require("../database/models/botlist/bots.js")
module.exports.run = async (client,message,args) => {
  let x = await botdata.find();
  let bots = await x.filter(a => a.ownerID == message.author.id || a.coowners.includes(message.author.id))
   const embed = new Discord.MessageEmbed()
   
   .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
   .setDescription(`<a:yes:833101995723194437> **[SnowBots Help Menu](https://SnowBots.cf)** <a:yes:833101995723194437>`)
   .setColor("#7289da")
   .setFooter('Powered By SnowBots.cf')
   .addField("Extra Commands", "**\n`+`faq\n`+`emojis\n`+`support\n`+`news\n`+`addbot\n`+`addserver\n`+`topvoted\n`+`ping**" )
   .setImage('https://cdn.discordapp.com/attachments/860627883731320866/872485215262605332/SnowBots.cf.png')

   let button = new MessageButton()
  .setStyle('url')
  .setURL('https://discord.com/api/oauth2/authorize?client_id=863104463229550612&permissions=8&redirect_uri=https%3A%2F%2FSnowBots.cf%2Fcallback&scope=bot') 
  .setLabel('Invite')
  .setEmoji('870019597791805521');

  let button2 = new MessageButton()
  .setStyle('url')
  .setURL('https://SnowBots.cf/dc') 
  .setLabel('Support')
  .setEmoji('872580192063860787');
  
  let button3 = new MessageButton()
  .setStyle('url')
  .setURL('https://SnowBots.cf') 
  .setLabel('Website')
  .setEmoji('872580084077326337');
  
  let button4 = new MessageButton()
  .setStyle('url')
  .setURL('https://SnowBots.cf/bot/863104463229550612') 
  .setLabel('Vote')
  .setEmoji('872580144714358784');

let row = new MessageActionRow()
  .addComponents(button, button2, button3, button4);
return message.channel.send({ embed: embed, buttons: [ button,button2,button3,button4 ]
});
 message.channel.send(embed)
};
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["Extra", "Extras", "extras"],
  };
  
  exports.help = {
    name: "extras",
    description: "",
    usage: ""
  };