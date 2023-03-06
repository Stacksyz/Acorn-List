/*=======================================================================================*/
const Discord = require("discord.js");
const { Client, Collection } = require("discord.js");
const client = (global.Client = new Client())
const config = require("./config.js");
global.config = config;
const fs = require("fs");
client.htmll = require('cheerio');
const { CanvasSenpai } = require("canvas-senpai")
const canva = new CanvasSenpai();
const request = require("request");
let botsdata = require("./src/database/models/botlist/bots.js");
let profiledata = require("./src/database/models/profile.js");
const db = require("quick.db");
const ms = require("parse-ms");


/*=======================================================================================*/


let botDataSchema = require('./src/database/models/botlist/bots.js');
let statusBotsDataSchema = new Map();
//FOR BOT GOING ONLINE / OFFLINE LOGGING
client.on("presenceUpdate", async (oldPresence, newPresence) => {
    if(newPresence.guild.id == config.server.id){
        if(oldPresence && newPresence && newPresence.member.user.bot) {
            let botData = await botDataSchema.findOne({ botID: newPresence.member.id })
            if(!botData) return; //not a bot in the db
            let channel = await client.channels.fetch(config.server.channels.uptimelog).catch(()=>{return;})
            if(oldPresence.status && oldPresence.status != "offline" && newPresence.status && newPresence.status == "offline") {
                setTimeout(async() => {
                    try{
                        let member = await newPresence.guild.members.fetch(newPresence.member.id)
                        if(member.presence.status != "offline") return;
                        console.log(`Presence Offline for: ${newPresence.member.user.tag} | ${newPresence.status}`)
                        channel.send(`<@${botData.ownerID}>`, {content: `<@${botData.ownerID}>`, embed: new Discord.MessageEmbed()
                            .setAuthor(newPresence.member.user.tag, newPresence.member.user.displayAvatarURL())
                            .setTitle(`<:offline:862306785133592636> **Your Bot \`${newPresence.member.user.tag}\` went offline!**`)
                            .setURL(`https://SnowBots.cf/bot/${newPresence.member.id}`)
                            .setColor("RED")
                            .setThumbnail(newPresence.member.user.displayAvatarURL())
                            .setDescription(`***It is <@${newPresence.member.id}> this Bot!***`)
                        }).then(async msg => {
                            statusBotsDataSchema.set(newPresence.member.user.id, msg.id);
                        })
                    }catch (e){
                        console.log(e)
                    }
                }, 60e3);
            }
            //if user goes online
            if(oldPresence.status && oldPresence.status == "offline" && newPresence.status && newPresence.status != "offline") {
                console.log(`Presence Online for: ${newPresence.member.user.tag} | ${newPresence.status}`)
                if(statusBotsDataSchema.has(newPresence.member.user.id) && statusBotsDataSchema.get(newPresence.member.user.id)){
                    try{
                        let themsg = await channel.messages.fetch(statusBotsDataSchema.get(newPresence.member.user.id));
                        if(!themsg || !themsg.id) throw "not found";
                        themsg.edit(`<@${botData.ownerID}>`, {content: `<@${botData.ownerID}>`, embed: new Discord.MessageEmbed()
                            .setAuthor(newPresence.member.user.tag, newPresence.member.user.displayAvatarURL())
                            .setTitle(`<:online:862306785007632385> **Your Bot \`${newPresence.member.user.tag}\` is back online!**`)
                            .setURL(`https://SnowBots.cf/bot/${newPresence.member.id}`)
                            .setColor("GREEN")
                            .setThumbnail(newPresence.member.user.displayAvatarURL())
                            .setDescription(`***It is <@${newPresence.member.id}> this Bot!***\n:heart: *Thanks for bringing it back online!*`)
                        }).catch((e)=>{console.log(e)});
                    }catch (e){
                        console.log(e)
                        channel.send(`<@${botData.ownerID}>`, {content: `<@${botData.ownerID}>`, embed: new Discord.MessageEmbed()
                            .setAuthor(newPresence.member.user.tag, newPresence.member.user.displayAvatarURL())
                            .setTitle(`<:online:862306785007632385> **Your Bot \`${newPresence.member.user.tag}\` is back online!**`)
                            .setURL(`https://SnowBots.cf/bot/${newPresence.member.id}`)
                            .setColor("GREEN")
                            .setThumbnail(newPresence.member.user.displayAvatarURL())
                            .setDescription(`***It is <@${newPresence.member.id}> this Bot!***\n:heart: *Thanks for bringing it back online!*`)
                        }).catch((e)=>{console.log(e)})
                    }
                    //delete the Bot from the system again
                    statusBotsDataSchema.delete(newPresence.member.user.id);
                }
            }
        }
    }
});


/*=======================================================================================*/
/* Client when detects 
a new member join */


  client.on("guildMemberAdd", async member => {
     let data = await canva.welcome(member, { link: "https://cdn.discordapp.com/attachments/860627883731320866/880455779289821244/welcomeimg_5.png" })

 

    const attachment = new Discord.MessageAttachment(

      data,

      "welcome-image.png"

    );

  let channel = member.guild.channels.cache.find(c => c.name === '👋・⌬〢welcome')
  let WELCOME = new Discord.MessageEmbed()
  .setTitle('New User Has Joined SnowBots.cf')
  .setDescription(`${member.user} Welcome to **SnowBots.cf** Support Server!\n\nWe have \`${member.guild.memberCount}\` members!`)
  .setColor('BLUE')
  .setThumbnail(client.user.avatarURL)
  .setTimestamp()
  .setFooter('Thanks For Joining!')
  channel.send(WELCOME)
})
  client.on("guildMemberRemove", async member => {
    let data = await canva.welcome(member, { link: "https://cdn.discordapp.com/attachments/860627883731320866/880455779289821244/welcomeimg_5.png" })

 

    const attachment = new Discord.MessageAttachment(

      data,

      "welcome-image.png"

    );
  let channel = member.guild.channels.cache.find(c => c.name === '👋・⌬〢welcome')
  let BYE = new Discord.MessageEmbed()
  .setTitle('User Has Left SnowBots.cf')
  .setDescription(`${member.user} Left **SnowBots.cf** Support Server!\n\nWe have \`${member.guild.memberCount}\` members!`)
  .setColor('BLUE')
  .setThumbnail(client.user.avatarURL)
  .setTimestamp()
  .setFooter('Come Back Soon!')
  channel.send(BYE)
})

/*/*--------------------=========SnowBots.cf=========--------------------*/
require('events').EventEmitter.prototype._maxListeners = 100;
client.komutlar = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./src/commands", (err, files) => {
  if (err) console.error(err);
  console.log(`[SnowBots.cf]: ${files.length} command loaded.`);
  files.forEach(f => {
    if (!f.endsWith('.js')) return
    let props = require(`./src/commands/${f}`);
    if (!props.help) return
    client.komutlar.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
      global.commands = files;
    });
  });
});

client.on('message', async message => {
  if (message.author.bot) return;
  var find = await profiledata.findOne({ userID: message.author.id })
  try {
    var mycoins = find.coins
    await profiledata.findOneAndUpdate({
      userID: message.author.id
    }, {
        $set: {
          coins: parseInt(mycoins) + 1
        }
      })
  } catch (e) {
    if (!find) {
      await new profiledata({
        userID: message.author.id,
        coins: '1',
      }).save()
    }
  }
  let p = config.bot.prefix
  let client = message.client;
  if (message.author.bot) return;
  if (!message.content.startsWith(p)) return;
  let command = message.content.split(" ")[0].slice(p.length);
  let params = message.content.split(" ").slice(1);
  let cmd
  if (client.komutlar.has(command)) {
    cmd = client.komutlar.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.komutlar.get(client.aliases.get(command));
  }
  if (cmd) {
    cmd.run(client, message, params, p);
  }
  if (!cmd) return;
})
/*=======================================================================================*/


/*=======================================================================================*/
const claudette = require("./src/database/models/uptime.js")
setInterval(() => {
  claudette.find({}, function(err, docs) {
    if (err) console.log(err)
    if (!docs) return;
    docs.forEach(docs => {
      request(docs.link, async function(error, response, body) {
        if (error) {
          console.error(`${docs.link} has been deleted on uptime system.\nReason: Invalid domain so request failed.`);
          await claudette.findOneAndDelete({ code: docs.code })
        }
      });
    })
  })
}, 60000)

client.on('guildMemberRemove', async member => {
  if (member.guild.id !== config.serverID) return
  claudette.find({ userID: member.id }, async function(err, docs) {
    await docs.forEach(async a => {
      await claudette.findOneAndDelete({ userID: member.id, code: a.code, server: a.server, link: a.link })
    })
  })
})
/*=======================================================================================*/


/*=======================================================================================*/
const votes = require('./src/database/models/botlist/vote.js')
const votesServer = require('./src/database/models/servers/user.js')
client.on('ready', async () => {
  setInterval(async () => {
    let datalar = await votes.find()
    if (datalar.length > 0) {
      datalar.forEach(async a => {
        let süre = a.ms - (Date.now() - a.Date)
        if (süre > 0) return
        await votes.findOneAndDelete({ bot: a.bot, user: a.user })
      })
    }
  }, 1500000)
})
client.on('ready', async () => {
  setInterval(async () => {
    let voteServer = await votesServer.find()
    if (voteServer.length > 0) {
      voteServer.forEach(async a => {
        let süre = 1800000 - (Date.now() - a.date)
        if (süre > 0) return
        await votesServer.findOneAndDelete({ guild: a.guild, id: a.id, date: a.date })
      })
    }
  }, 300000)
})
/*=======================================================================================*/


/*=======================================================================================*/

client.on("guildMemberAdd", async (member) => {
  let guild = client.guilds.cache.get(config.server.id);
  if (member.user.bot) {
    try {
      guild.member(member.id).roles.add(config.server.roles.botlist.bot);
    } catch (error) {

    }
  }
});
/*=======================================================================================*/


/*
    SERVER LIST CLIENT 
*/
const serverClient = new Client();
serverClient.login(config.bot.servers.token);
global.clientSL = serverClient;
require("./src/servers/client.js");


/*=======================================================================================*/
require("./src/server.js")(client);
require("./src/database/connect.js")(client);

client.login(config.bot.token);
client.on('ready', async () => {
  console.log("[SnowBots.cf]: Bot successfully connected as " + client.user.tag + ".");
  let botsSchema = require("./src/database/models/botlist/bots.js");
  const bots = await botsSchema.find();
  client.user.setPresence({ activity: { type: 'WATCHING', name: '+help | ' + bots.length + ' bots' }, status: "online" });
});


let voiceStates = {}

client.on('voiceStateUpdate', async (oldState, newState) => {
  var { id } = oldState // This is the user's ID
  if (!oldState.channel) {
    console.log("user connected.");
    // The user has joined a voice channel
    voiceStates[id] = new Date()
  } else if (!newState.channel) {
    console.log("user disconnected.");
    var now = new Date()
    var joined = voiceStates[id] || new Date()
    var rewards = Math.floor(Math.random() * 5) + 1;
    // This will be the difference in milliseconds
    var dateDiff = now.getTime() - joined.getTime()
    if (dateDiff >= 60000) {
      console.log("I have given some SnowBots Coins to that user")
      var randomNumber = Math.floor(Math.random() * 3) + 1;
      var find = await profiledata.findOne({ userID: newState.member.id })
      if (!find.userID) {
        await new profiledata({
          userID: newState.member.id,
          coins: '1'
        })
      }
      let mycoins = find.coins
      if (find.coins) {
        await profiledata.findOneAndUpdate({
          userID: newState.member.id
        }, {
            $set: {
              coins: parseInt(mycoins) + 5
            }
          }, function(err, docs) { })
      }
      if (!find.coins) {
        await profiledata.findOneAndUpdate({
          userID: newState.member.id
        }, {
            $set: {
              coins: '1'
            }
          }, function(err, docs) { })
      }
      client.channels.cache.get('1053334264181174322').send(new Discord.MessageEmbed().setTitle(`SnowBots Coins`).setDescription(`Hey <@${newState.member.id}>, You have gained some **SnowBots Coins** for being active!\n<:members:876940862305751121> View your [profile](https://SnowBots.cf/user/${newState.member.id})`).setFooter(`CopyRight @ 2020 - 2022 SnowBots.cf All Rights Served`))

      client.channels.cache.get('1053334264181174322').send(`<@${newState.member.id}>`)
    }
  }
})

/*=======================================================================================*/

/* RESET DATA'S EVERY MONTHS */

// BOT/SERVER VOTES & ANALYTICS
const {
  CronJob
} = require('cron')
const botlar = require('./src/database/models/botlist/bots.js')
const servers = require('./src/database/models/servers/server.js')
client.on('ready', async () => {
  var resetStats = new CronJob('00 00 1 * *', async function() {
    let x = await botlar.find()
    await x.forEach(async a => {
      await botlar.findOneAndUpdate({
        botID: a.botID
      }, {
          $set: {
            votes: 0,
            analytics_invites: 0,
            analytics_visitors: 0,
            country: {},
            analytics: {}
          }
        })
    })
    let sunucular = await servers.find()
    await sunucular.forEach(async a => {
      await servers.findOneAndUpdate({
        id: a.id
      }, {
          $set: {
            boosts: 0,
            votes: 0,
            bumps: 0,
            analytics_joins: 0,
            analytics_visitors: 0,
            country: {},
            analytics: {}
          }
        })
    })
  }, null, true, 'Europe/Istanbul');
  resetStats.start();
})