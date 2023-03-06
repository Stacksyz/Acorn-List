
        module.exports = {
            bot: {
                token: process.env.BTOKEN, 
 // Bot List Bot Token
                prefix: "sb!",
                owners: ["847213179142799452"],
                mongourl: process.env.MONGO,
                servers: {
                    token: process.env.STOKEN, // Server List Bot Token
                    prefix: "sbs!"
                }
            },
        
            website: {
                callback: process.env.CALLBACK, //Login Call Back, Example: https://SnowBots.cf/callback
                secret: process.env.SECRET, //Bot Secret Id.
                clientID: process.env.CLIENTID, // Bot client id.
                clientID2: "1053295843727392878",
                tags: [ "Moderation", "Fun", "Minecraft","Economy","Guard","NSFW","Anime","Invite","Music","Logging", "Web Dashboard", "Reddit", "Youtube", "Twitch", "Crypto", "Leveling", "Game", "Roleplay", "Utility", "Turkish" ],
                languages: [
                    { flag: 'gb', code: 'en', name: 'English' },
                    { flag: 'in', code: 'hi', name: 'हिंदी' },
                    { flag: 'in', code: 'te', name: 'తెలుగు' },
                    { flag: 'tr', code: 'tr', name: 'Türkçe' },
                    { flag: 'de', code: 'de', name: 'Deutsch' },
                    { flag: 'it', code: 'it', name: 'Italiano' },
                    { flag: 'ne', code: 'ne', name: 'नेपाली' },
                    { flag: 'ar', code: 'ar', name: 'العربية' },
                    { flag: 'fr', code: 'fr', name: 'French' },
                    { flag: 'pl', code: 'pl', name: 'Polish' },
                    { flag: 'es', code: 'es', name: 'Spain' }
                ],
                servers: {
                    tags: [
                    {
                        icon: "fal fa-code",
                        name: "Development"
                    },
                    {
                        icon: "fal fa-play",
                        name: "Stream"
                    },
                    {
                        icon: "fal fa-camera",
                        name: "Media"
                    },
                    {
                        icon: 'fal fa-building',
                        name: 'Company'
                    },
                    {
                        icon: 'fal fa-gamepad',
                        name: 'Game'
                    },
                    {
                        icon: 'fal fa-icons',
                        name: 'Emoji'
                    },
                    {
                        icon: 'fal fa-robot',
                        name: 'Bot List'
                    },
                    {
                        icon: 'fal fa-server',
                        name: 'Server List'
                    },
                    {
                        icon: 'fal fa-moon-stars',
                        name: 'Turkish'
                    },
                    {
                        icon: 'fab fa-discord',
                        name: 'Support'
                    },
                    {
                        icon: 'fal fa-volume',
                        name: 'Sound'
                    },
                    {
                        icon: 'fal fa-comments',
                        name: 'Chatting'
                    },
                    {
                        icon: 'fal fa-lips',
                        name: 'NSFW'
                    },
                    {
                      icon: "fal fa-comment-slash",
                      name: "Challange"
                    },
                    {
                      icon: "fal fa-hand-rock",
                      name: "Protest"
                    },
                    {
                      icon: "fal fa-headphones-alt",
                      name: "Roleplay"
                    },
                    {
                      icon: "fal fa-grin-alt",
                      name: "Meme"
                    },
                    {
                      icon: "fal fa-shopping-cart",
                      name: "Shop"
                    },
                    {
                      icon: "fal fa-desktop",
                      name: "Technology"
                    },
                    {
                      icon: "fal fa-laugh",
                      name: "Fun"
                    },
                    {
                      icon: "fal fa-share-alt",
                      name: "Social"
                    },
                    {
                      icon: "fal fa-laptop",
                      name: "E-Spor"
                    },
                    {
                      icon: 'fal fa-palette',
                      name: 'Design'
                    },
                    {
                      icon: 'fal fa-users',
                      name: 'Community'
                    }
                    ]                
                }
            },
        
            server: {
                id: "1053268172263915561",
                invite: "https://discord.gg/FECm7Rytvw",
                dslinvite: "https://discord.com/oauth2/authorize?client_id=1053026257559879721&permissions=8&scope=bot",
                dblinvite: "https://discord.com/api/oauth2/authorize?client_id=1053295843727392878&permissions=8&redirect_uri=https%3A%2F%2FSnowBots.cf%2Fauth%2Fcallback&scope=bot",
    roles: {
      yonetici: "1053331399442174042",
      manager: "1053331407029669910", 
      booster: "1053331435882287154",
      sponsor: "1053331418719199303", 
      community: "1053331440596688946",
      supporter: "1053331429293043722", 
      partnerRole: "1053331423370678302",
      site_creator: "1053331399442174042",
      administrator: "1053331410179600415",
      moderator: "1053331417590943764",
      premiumuser: "1053333131295469578",
      donator: "1053332783256313896",
      javauser: "1053332789921071184",
      pythonuser: "1053332793750474794",
      bh: "1053332800859799602",
      gbh: "1053332809361670175",
      profile: {
        sitecreator:"1053331399442174042",
        booster: "1053331435882287154",
        community: "1053331440596688946",
        sponsor: "1053331418719199303", 
        supporter: "1053331429293043722", 
        manager: "1053331407029669910", 
        partnerRole: "1053331423370678302"
      },
      codeshare: {
        javascript: "JS",
        html: "HTML",
        substructure: "Substructure",
        bdfd: "BDFD", // Bot Designer For Discord
        fiveInvite: "5 INVITES",
        tenInvite: "10 INVITES",
        fifteenInvite: "15 INVITES",
        twentyInvite: "20 INVITES"
      },
      botlist: {
        ownerserver: "1053331399442174042",
        developer: "1053332490019950692",
        certified_developer: "1053331444010864661",
        boosted_developer: "1053331446745538621",
        promoted_developer: "1053331448339374091",
        premium_developer: "1053331450176479232", // premium server owner role id
        bot: "1053332435120685066",
        boosted_bot: "1053332292812156929",
        promoted_bot: "1053332298919059506",
        certified_bot: "1053332271458947142"
      }
    },
                channels: {
                    codelog: "1053333499731509338",
                    login: "1053333775095967744",
                    webstatus: "1053333834936103012",
                    uptimelog: "1053333529435590796",
                    botlog: "1053333585958015067",
                    votes: "1053333602026405898",
                    reportlog: "1053333612751233054"
    }
  }


}
