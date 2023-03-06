
        module.exports = {
            bot: {
                token: process.env.BTOKEN, 
 // Bot List Bot Token
                prefix: "al!",
                owners: ["847213179142799452"],
                mongourl: process.env.MONGO,
                servers: {
                    token: process.env.STOKEN, // Server List Bot Token
                    prefix: "asl!"
                }
            },
        
            website: {
                callback: process.env.CALLBACK, //Login Call Back, Example: https://list.acorn.ink/callback
                secret: process.env.SECRET, //Bot Secret Id.
                clientID: process.env.CLIENTID, // Bot client id.
                clientID2: "1082257222572195901",
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
                id: "1082257568027652128",
                invite: "https://discord.gg/ftqX755Q3e",
                dslinvite: "https://discord.com/api/oauth2/authorize?client_id=1082257222572195901&permissions=8&scope=bot",
                dblinvite: "https://discord.com/api/oauth2/authorize?client_id=1082256413251866706&permissions=8&scope=bot%20applications.commands",
    roles: {
      yonetici: "1082259779017252884",
      manager: "1082261512846061608", 
      booster: "1082261525701603329",
      sponsor: "1082261525177303050", 
      community: "1082262584163573790",
      supporter: "1082261527899426899", 
      partnerRole: "1082261527022813234",
      site_creator: "1082259779017252884",
      administrator: "1082261521763151962",
      moderator: "1082261523029819453",
      premiumuser: "1082263021189070848",
      donator: "1082261823123882085",
      javauser: "1082262590975115284",
      pythonuser: "1082262592560570488",
      bh: "1082262594297016330",
      gbh: "1082263018232086578",
      profile: {
        sitecreator:"1082259779017252884",
        booster: "1082261525701603329",
        community: "1082262584163573790",
        sponsor: "1082261525177303050", 
        supporter: "1082261527899426899", 
        manager: "1082261512846061608", 
        partnerRole: "1082261527022813234"
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
        ownerserver: "1082259779017252884",
        developer: "1082261829943836753",
        certified_developer: "1082261826445770812",
        boosted_developer: "1082261827385294858",
        promoted_developer: "1082261828526162032",
        premium_developer: "1082261824738693140", // premium server owner role id
        bot: "1082262582636851271",
        boosted_bot: "1082262581294669865",
        promoted_bot: "1082262579520471091",
        certified_bot: "1082262577695969280"
      }
    },
                channels: {
                    codelog: "1082263683088003182",
                    login: "1082263735101554728",
                    webstatus: "1082259568152813568",
                    uptimelog: "1082263799647719535",
                    botlog: "1082258619065704509",
                    votes: "1082263985983869008",
                    reportlog: "1082263919739031633"
    }
  }


}
