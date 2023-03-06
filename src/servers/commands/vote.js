const Discord = require(`discord.js`);
const {
  registerFont,
  createCanvas,
  loadImage
} = require(`canvas`);
const { parse } = require( "twemoji-parser" )
registerFont( "./src/assets/fonts/DMSans-Bold.ttf" , { family: "DM Sans", weight: "bold" } );
registerFont( "./src/assets/fonts/DMSans-Regular.ttf" , { family: "DM Sans", weight: "regular" } );
registerFont( "./src/assets/fonts/STIXGeneral.ttf" , { family: "STIXGeneral" } );
registerFont( "./src/assets/fonts/AppleSymbol.ttf" , { family: "AppleSymbol" } );
registerFont( "./src/assets/fonts/Arial.ttf"       , { family: "Arial" } );
registerFont( "./src/assets/fonts/ArialUnicode.ttf", { family: "ArielUnicode" } );
registerFont('./src/assets/fonts/Genta.ttf', { family: 'Genta' } );
registerFont("./src/assets/fonts/UbuntuMono.ttf", { family: "UbuntuMono" } );
const Fonts = "'DM Sans', STIXGeneral, AppleSymbol, Arial, ArialUnicode";
const ms = require(`pretty-ms`)
const serverData = require(`../../database/models/servers/server.js`);
exports.run = async (client, message, args) => {
  let findServer = await serverData.findOne({
    id: message.guild.id
  });
  if (!findServer) return await msgError(`This server was not found in our list.\nAdd your server: [SnowBots.cf/server/add](https://SnowBots.cf)`, {
    channel: message.channel
  })
  let cooldown = 2 * 60 * 60 * 1000; //This is the same as in index in the auto bump deleter
  let lastDaily = findServer.vote;
  let timeObj = ms(cooldown - (Date.now() - lastDaily), {
    verbose: true
  });
  if (cooldown - (Date.now() - lastDaily) > 0) {
    return await msgError(`This Server can only be voted once every 2 hours.\n\`${timeObj}\` Time Left...`, {
      channel: message.channel
    });
  } else {
    const canvas = createCanvas(1500, 500);
    const ctx = canvas.getContext(`2d`)
    ctx.save();
    const bg = await loadImage("./src/assets/base.png")
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height );
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.arc(126 + 158.5, 92 + 158.5, 158.5, 0, Math.PI * 2, true); 
    ctx.closePath();
    ctx.clip();
    const avatar = await loadImage(message.guild.iconURL({format: "png", dynamic: "false", size: 4096}));
    ctx.drawImage(avatar, 126, 92, 317, 317);
    ctx.restore();
    ctx.font = `bold 100px ${Fonts}`;
    ctx.fillStyle = "#ffffff"
    let fontsize = 100;
    let currWidth = 0;
    const name = message.guild.name;
    while(ctx.measureText(name).width > 900){
        ctx.font = `bold ${ fontsize-- }px ${Fonts}`;
    }
    for (const character of name) {
        const parseEmoji = parse(character);
        if ( parseEmoji.length ) {
            const img = await loadImage( parseEmoji[0].url );
            ctx.drawImage( img, 475 + currWidth, 200 - fontsize + 10, fontsize - 3, fontsize - 3 );
            currWidth += fontsize;
        } else {
            ctx.fillText( character, 475 + currWidth, 200 );
            currWidth += ctx.measureText( character ).width;
        };
    }
    ctx.font = `bold 100px ${Fonts}`;
    ctx.fillStyle = "#00ff45"
    ctx.fillText("VOTED", 600, 325);
    
    ctx.font = `bold 50px ${Fonts}`;
    ctx.fillStyle = "#888888"
    ctx.fillText(`You can vote again in: ${ms(cooldown, {verbose: true})}`, 482, 400);
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `voted.png`);
    const bumbedEmbed = new Discord.MessageEmbed()
      .setTitle(`<a:yes:833101995723194437> Voted **${message.guild.name}**`)
      .setColor(`GREEN`)
      .setAuthor(message.author.username, message.author.avatarURL({
        dynamic: true
      }))
      .setDescription(`**You can vote again in: \`${ms(cooldown, {verbose: true})}\`**`)
      .setImage("attachment://voted.png")
      .attachFiles(attachment);
    message.channel.send({embed: bumbedEmbed});
    await serverData.updateOne({
      id: message.guild.id
    }, {
      $set: {
        vote: new Date().getTime()
      }
    })
    await serverData.updateOne({
      id: message.guild.id
    }, {
      $inc: {
        votes: 1
      }
    })
    return;
  }
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: []
};
exports.help = {
  name: `vote`,
  description: ``,
  usage: ``
};

function msgError(msg, {
  channel
}) {
  channel.send(new Discord.MessageEmbed()
    .setAuthor(global.clientSL.user.username, global.clientSL.user.avatarURL())
    .setFooter(`SnowBots.cf/servers`, `https://cdn.discordapp.com/avatars/863104463229550612/8c96923623d21cb7db7796c8f07c2615.webp?size=4096`)
    .setTitle(`:x: Error`)
    .setDescription(msg)
    .setColor(`RED`)
  )
}