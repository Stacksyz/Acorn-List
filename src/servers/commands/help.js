const { MessageButtonPages } = require("discord-button-page");
const { MessageEmbed, Client } = require("discord.js");
const client = new Client();


module.exports.run = async (client,message,args) => {
    let embed = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
    .setColor("#0x2f3136")
    .setTitle("Acorn Help Menu")
    .setDescription("\n2 - :musical_note: Music  <:ping:882385378257039371>\n3 - <:bot:876940784119734312> Botlist\n4 - <:ServerTag:879478250961776660> Serverlist\n5 - <:util:879478933672841226> Utility\n6 - <:admin:879478601609781329> Admin\n7 - <:uptime:876259414678593596> Extras\n8 - <:premium:879478503697952818> Premium\n9 - <:newspaper:872523515230847027> News")
    .setImage('https://cdn.discordapp.com/attachments/878005921895309383/880945510335250472/welcomeimg_6.png')
    .setFooter(" Page 1/8 Powered by Acorn.ink")

let embed1 = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
    .setColor("#0x2f3136")
    .setTitle(":musical_note: Acorn Music")
    .setDescription(":gear: **__Settings__**\n> `afk,` `defaultautoplay,` `defaultequalizer,` `defaultvolume,` `playmsg,` `music-prefix`\n\n:musical_note: **__Music__**\n> `addprevious,` `autoplay,` `clearqueue,` `forward,` `grab,` `join,` `jump,` `loop,` `loopqueue,` `loopsong,` `lyrics,` `move,` `moveme,` `nowplaying,` `pause,` `play,` `playlist,` `playmusicmix,` `playprevious,` `playsc,` `playskip,` `playskipsc,` `queue,` `queuestatus,` `radio,` `removedupes,` `removetrack,` `removevoteskip,` `restart,` `resume,` `rewind,` `search,` `searchradio,` `searchsc,` `seek,` `shuffle,` `skip,` `stop,` `unshuffle,` `volume`\n\n:eyes: **__Filters__**\n> `8d,` `bassboost,` `china,` `chipmunk,` `cleareq,` `clearfilter,` `darthvader,` `equalizer,` `nightcore,` `pitch,` `speed,` `slowmo,` `rate,` `tremolo,` `vibrato,` `vibrate`\n\n")
    .setImage('https://cdn.discordapp.com/attachments/878005921895309383/880945510335250472/welcomeimg_6.png')
    .setFooter(" Page 2/8 Powered by Acorn.ink")

    let embed2 = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
    .setColor("#0x2f3136")
    .setTitle("<:bot:876940784119734312> Acorn Botlist")
    .setDescription("> `bots,` `botinfo`")
    .setImage('https://cdn.discordapp.com/attachments/878005921895309383/880945510335250472/welcomeimg_6.png')
    .setFooter(" Page 2/8 Powered by Acorn.ink")

    let embed3 = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
    .setColor("#0x2f3136")
    .setTitle("<:ServerTag:879478250961776660> Acorn Serverlist")
    .setDescription("> `boost,` `bump,` `vote,` `link,` `profile`")
    .setImage('https://cdn.discordapp.com/attachments/878005921895309383/880945510335250472/welcomeimg_6.png')
    .setFooter(" Page 3/8 Powered by Acorn.ink")

    let embed4 = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
    .setColor("#0x2f3136")
    .setTitle("<:util:879478933672841226> Acorn Utility")
    .setDescription("> `whois,` `serverinfo`")
    .setImage('https://cdn.discordapp.com/attachments/878005921895309383/880945510335250472/welcomeimg_6.png')
    .setFooter(" Page 4/8 Powered by Acorn.ink")

    let embed5 = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
    .setColor("#0x2f3136")
    .setTitle("<:admin:879478601609781329> Acorn Admin")
    .setDescription("> `queue,` `steal`")
    .setImage('https://cdn.discordapp.com/attachments/878005921895309383/880945510335250472/welcomeimg_6.png')
    .setFooter(" Page 5/8 Powered by Acorn.ink")

    let embed6 = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
    .setColor("#0x2f3136")
    .setTitle("<:uptime:876259414678593596> Acorn Extras")
    .setDescription("> `faq,` `emojis,` `support,` `addbot,` `addserver,` `topvoted,` `ping,` `poke`")
    .setImage('https://cdn.discordapp.com/attachments/878005921895309383/880945510335250472/welcomeimg_6.png')
    .setFooter(" Page 6/8 Powered by Acorn.ink")

    let embed7 = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
    .setColor("#0x2f3136")
    .setTitle("<:premium:879478503697952818> Acorn Premium")
    .setDescription("> `shorturl`")
    .setImage('https://cdn.discordapp.com/attachments/878005921895309383/880945510335250472/welcomeimg_6.png')
    .setFooter(" Page 7/8 Powered by Acorn.ink")

    let embed8 = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
    .setColor("#0x2f3136")
    .setTitle("<:newspaper:872523515230847027> Acorn News")
    .setDescription("**Latest News!**\n\nTitle: **Added Few New Commands**\n> I have finally added a few new comamnds, `steal,` and `poke` as well ad MUSIC COMMANDS! Enjoy!\n\nOops...\nLooks like thats the end of our News!\n\nView More News [here](https://list.acorn.ink/news)")
    .setImage('https://cdn.discordapp.com/attachments/878005921895309383/880945510335250472/welcomeimg_6.png')
    .setFooter(" Page 8/8 Powered by Acorn.ink")


   const embedPages = new MessageButtonPages()
    .setEmbed([embed, embed1, embed2, embed3, embed4, embed5, embed6, embed7, embed8]) // Embed Object.
    .setChannel(message.channel) // Default = message.channel
    .setMessage("Powered by Acorn.ink!", true) // {boolean} True = react emoji when the message success send
    .setDuration(100000) // Duration time MS.
    .setCountPage() // {boolean} Default = true.
    .setEmoji("878757921922641990", "833101993668771842", "832598861813776394") // Default foreach emoji = "⬅️", "❌", "➡️".
    .setColor("green", "red", "green") // Default foreach color = "grey", "red", "grey".

    embedPages.buttonPages(message); // This must be async to message.
  }
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
  };
  
  exports.help = {
    name: "help",
    description: "",
    usage: ""
  };