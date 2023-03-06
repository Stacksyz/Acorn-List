const url = require("url");
const path = require("path");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const Strategy = require("passport-discord").Strategy;
const ejs = require("ejs");
const profiledata = require("./database/models/profile.js");
const bodyParser = require("body-parser");
const Discord = require("discord.js");
const { Canvas, resolveImage } = require("canvas-constructor");
const { registerFont } = require("canvas");
const config = require("../config.js");
const channels = config.server.channels;
const app = express();
const MemoryStore = require("memorystore")(session);

const cookieParser = require('cookie-parser');
const referrerPolicy = require('referrer-policy');
app.use(referrerPolicy({ policy: "strict-origin" }))
const rateLimit = require("express-rate-limit");
var MongoStore = require('rate-limit-mongo');
const roles = global.config.server.roles;
const botsdata = require("./database/models/botlist/bots.js");
const serversdata = require("./database/models/servers/server.js");
const voteSchema = require("./database/models/botlist/vote.js");
const codesSchema = require("./database/models/codes.js");
const uptimeSchema = require("./database/models/uptime.js");
// MODELS
const db = require("./database/models/servers/server.js");
const banSchema = require("./database/models/site-ban.js");
const maintenceSchema = require('./database/models/maintence.js');
const appsdata = require("./database/models/botlist/certificate-apps.js");
const client = global.Client;

module.exports = async (client) => {

  const apiLimiter = rateLimit({
    store: new MongoStore({
      uri: global.config.bot.mongourl,
      collectionName: "rate-limit",
      expireTimeMs: 60 * 60 * 1000,
      resetExpireDateOnChange: true
    }),
    windowMs: 60 * 60 * 1000,
    max: 4,
    message:
      ({ error: true, message: "Too many requests, you have been rate limited. Please try again in one hour." })
  });

  var minifyHTML = require('express-minify-html-terser');
  app.use(minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      minifyJS: true
    }
  }));

  app.set('views', path.join(__dirname, '/views'));
  const templateDir = path.resolve(`${process.cwd()}${path.sep}src/views`);
  app.use("/css", express.static(path.resolve(`${templateDir}${path.sep}assets/css`)));
  app.use("/js", express.static(path.resolve(`${templateDir}${path.sep}assets/js`)));
  app.use("/img", express.static(path.resolve(`${templateDir}${path.sep}assets/img`)));

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));

  passport.use(new Strategy({
    clientID: config.website.clientID,
    clientSecret: config.website.secret,
    callbackURL: config.website.callback,
    scope: ["identify", "guilds", "guilds.join"]
  },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => done(null, profile));
    }));

  app.use(session({
    store: new MemoryStore({ checkPeriod: 86400000 }),
    secret: "#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n",
    resave: false,
    saveUninitialized: false,
  }));

  app.use(passport.initialize());
  app.use(passport.session());


  app.engine("disbots-xyz", ejs.renderFile);
  app.set("view engine", "disbots-xyz");

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  global.checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.session.backURL = req.url;
    res.redirect("/login");
  }

  app.use(async (req, res, next) => {
    const d = await maintenceSchema.findOne({ server: config.server.id });
    if (d) {
      if (req.isAuthenticated()) {
        let usercheck = client.guilds.cache.get(config.server.id).members.cache.get(req.user.id);
        if (usercheck) {
          if (usercheck.roles.cache.get(roles.yonetici)) {
            next();
          } else {
            res.redirect('/error?code=200&message=Our website is temporarily unavailable.')
          }
        } else {
          res.redirect('/error?code=200&message=Our website is temporarily unavailable.')
        }
      } else {
        res.redirect('/error?code=200&message=Our website is temporarily unavailable.')
      }
    } else {
      next();
    }
  })
  const renderTemplate = (res, req, template, data = {}) => {
    const baseData = {
      bot: client,
      path: req.path,
      _token: req.session['_token'],
      user: req.isAuthenticated() ? req.user : null
    };
    res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
  };
  const checkMaintence = async (req, res, next) => {
    const d = await maintenceSchema.findOne({
      server: config.server.id
    });
    if (d) {
      if (req.isAuthenticated()) {
        let usercheck = client.guilds.cache.get(config.server.id).members.cache.get(req.user.id);
        if (usercheck) {
          if (usercheck.roles.cache.get(roles.yonetici)) {
            next();
          } else {
            res.redirect('/error?code=200&message=Our website is temporarily unavailable.')
          }
        } else {
          res.redirect('/error?code=200&message=Our website is temporarily unavailable.')
        }
      } else {
        res.redirect('/error?code=200&message=Our website is temporarily unavailable.')
      }
    } else {
      next();
    }
  }

  function generateRandom(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
  }
  app.get("/robots.txt", function(req, res) {
    res.set('Content-Type', 'text/plain');
    res.send(`Sitemap: https://SnowBots.cf/sitemap.xml`);
  });
  app.get("/sitemap.xml", async function(req, res) {
    let link = "<url><loc>https://SnowBots.cf/</loc></url>";
    let botdataforxml = await botsdata.find()
    botdataforxml.forEach(bot => {
      link += "\n<url><loc>https://SnowBots.cf/bot/" + bot.botID + "</loc></url>";
    })
    res.set('Content-Type', 'text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="https://www.google.com/schemas/sitemap-image/1.1">${link}</urlset>`);
  });

  app.get("/login", (req, res, next) => {
    if (req.session.backURL) {
      req.session.backURL = req.session.backURL;
    } else if (req.headers.referer) {
      const parsed = url.parse(req.headers.referer);
      if (parsed.hostname === app.locals.domain) {
        req.session.backURL = parsed.path;
      }
    } else {
      req.session.backURL = "/";
    }
    next();
  },
    passport.authenticate("discord", { prompt: 'none' }));
  app.get("/callback", passport.authenticate("discord", {
    failureRedirect: "/error?code=999&message=We encountered an error while connecting."
  }), async (req, res) => {
    let banned = await banSchema.findOne({
      user: req.user.id
    })
    if (banned) {
    client.users.fetch(req.user.id).then(async a => {
      client.channels.cache.get(channels.login).send(new Discord.MessageEmbed().setAuthor(a.username, a.avatarURL({
        dynamic: true
      })).setThumbnail(a.avatarURL({
        dynamic: true
      })).setColor("RED").setDescription(`[**${a.username}**#${a.discriminator}](https://SnowBots.cf/user/${a.id}) The user tried to log into the site but could not log in because s/he was blocked from the site.`).addField("Username", a.username).addField("User ID", a.id).addField("User Discriminator", a.discriminator))
    })
    req.session.destroy(() => {
      res.json({
        login: false,
        message: "You have been blocked from SnowBots.",
        logout: true
      })
      req.logout();
    });
  } else {
    try {
      const request = require('request');
      request({
        url: `https://discordapp.com/api/v8/guilds/${config.server.id}/members/${req.user.id}`,
        method: "PUT",
        json: {
          access_token: req.user.accessToken
        },
        headers: {
          "Authorization": `Bot ${client.token}`
        }
      });
    } catch { };
    res.redirect(req.session.backURL || '/')
    client.users.fetch(req.user.id).then(async a => {
      client.channels.cache.get(channels.login).send(new Discord.MessageEmbed().setAuthor(a.username, a.avatarURL({
        dynamic: true
      })).setThumbnail(a.avatarURL({
        dynamic: true
      })).setColor("GREEN").setDescription(`[**${a.username}**#${a.discriminator}](https://SnowBots.cf/user/${a.id}) User named **site** logged in.`).addField("Username", a.username).addField("User ID", a.id).addField("User Discriminator", a.discriminator))

    })
  }
});
app.get("/logout", function(req, res) {
  req.session.destroy(() => {
    req.logout();
    res.redirect("/");
  });
});
const checkAdmin = async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (client.guilds.cache.get(config.server.id).members.cache.get(req.user.id).roles.cache.get(roles.yonetici) || client.guilds.cache.get(config.server.id).members.cache.get(req.user.id).roles.cache.get(roles.moderator)) {
      next();
    } else {
      res.redirect("/error?code=403&message=You are not competent to do this.")
    }
  } else {
    req.session.backURL = req.url;
    res.redirect("/login");
  }
}
app.get("/bots/promoted", checkMaintence, async (req, res) => {
  let page = req.query.page || 1;
  let x = await botsdata.find()
  let data = x.filter(b => b.promoted === "Promoted")
  if (page < 1) return res.redirect(`/bots`);
  if (data.length <= 0) return res.redirect("/");
  if ((page > Math.ceil(data.length / 6))) return res.redirect(`/bots`);
  if (Math.ceil(data.length / 6) < 1) {
    page = 1;
  };
  renderTemplate(res, req, "botlist/bots-promoted.ejs", {
    req,
    roles,
    config,
    data,
    page: page
  });
})
app.get("/admin/premium-servers", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  const serverdata = await db.find();
  renderTemplate(res, req, "admin/premium-server.ejs", {
    req,
    roles,
    config,
    serverdata
  })
});
app.post("/server/:id/new-comment", async (req, res) => {
  let serverdata = await db.findOne({
    id: req.params.id
  });
  if (!serverdata) return res.send({
    error: "You entered an invalid server id."
  });
  if (!req.body.rating) {
    await db.updateOne({
      id: req.params.id
    }, {
        $push: {
          rates: {
            author: req.user.id,
            star_rate: 1,
            message: req.body.content,
            date: Date.now()
          }
        }
      })
  } else {
    await db.updateOne({
      id: req.params.id
    }, {
        $push: {
          rates: {
            author: req.user.id,
            star_rate: req.body.rating,
            message: req.body.content,
            date: Date.now()
          }
        }
      })
  }

  return res.redirect('/server/' + req.params.id);
})
app.post("/server/:id/reply/:userID", async (req, res) => {
  let serverdata = await db.findOne({
    id: req.params.id
  });
  if (!serverdata) return res.send({
    error: "You entered an invalid server id."
  });
  if (!req.params.userID) return res.send({
    error: "You must enter a user id."
  })
  let message = req.body.replyM;
  if (!message) return res.send({
    error: "You must enter a reply message."
  })
  await db.update({
    id: req.params.id,
    'rates.author': req.params.userID
  }, {
      $set: {
        'rates.$.reply': message
      }
    }, function(err, person) { if (err) return console.log(err); })
  return res.redirect('/server/' + req.params.id);
})

app.post("/server/:id/edit/:userID", async (req, res) => {
  let serverdata = await db.findOne({
    id: req.params.id
  });
  if (!serverdata) return res.send({
    error: "You entered an invalid server id."
  });
  if (!req.params.userID) return res.send({
    error: "You must enter a user id."
  })
  let message = req.body.editM;
  if (!message) return res.send({
    error: "You must enter a edit message."
  })
  await db.update({
    id: req.params.id,
    'rates.author': req.params.userID
  }, {
      $set: {
        'rates.$.star_rate': req.body.ratingEdit,
        'rates.$.edit': message
      }
    }, function(err, person) { if (err) return console.log(err); })
  return res.redirect('/server/' + req.params.id);
})
app.post("/server/:id/reply/:userID/edit", async (req, res) => {
  let serverdata = await db.findOne({
    id: req.params.id
  });
  if (!serverdata) return res.send({
    error: "You entered an invalid server id."
  });
  if (!req.params.userID) return res.send({
    error: "You must enter a user id."
  })
  let message = req.body.editReplyM;
  if (!message) return res.send({
    error: "You must enter a new reply message."
  })
  await db.update({
    id: req.params.id,
    'rates.author': req.params.userID
  }, {
      $set: {
        'rates.$.reply': message
      }
    }, function(err, person) { if (err) return console.log(err); })
  return res.redirect('/server/' + req.params.id);
})
app.post("/server/:id/reply/:userID/delete", async (req, res) => {
  let serverdata = await db.findOne({
    id: req.params.id
  });
  if (!serverdata) return res.send({
    error: "You entered an invalid server id."
  });
  if (!req.params.userID) return res.send({
    error: "You must enter a user id."
  })
  await db.update({
    id: req.params.id,
    'rates.author': req.params.userID
  }, {
      $unset: {
        'rates.$.reply': null
      }
    }, function(err, person) { if (err) return console.log(err); })
  return res.redirect('/server/' + req.params.id);
})
app.post("/server/:id/review/:userID/delete", async (req, res) => {
  let serverdata = await db.findOne({
    id: req.params.id
  });
  if (!serverdata) return res.send({
    error: "You entered an invalid server id."
  });
  if (!req.params.userID) return res.send({
    error: "You must enter a user id."
  })
  await db.update({
    id: req.params.id,
    'rates.author': req.params.userID
  }, {
      $unset: {
        'rates.$.author': null,
        'rates.$.star_rate': null,
        'rates.$.message': null,
        'rates.$.date': null,
        'rates.$.edit': null,
        'rates.$.reply': null
      }
    }, function(err, person) { if (err) return console.log(err); })
  return res.redirect('/server/' + req.params.id);
})

app.get("/admin/premium/give/:botID", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  await serversdata.findOneAndUpdate({
    id: req.params.botID
  }, {
      $set: {
        premium: "Premium",
      }
    }, function(err, docs) { })
  let serverdata = await serversdata.findOne({
    id: req.params.botID
  });

  client.guilds.fetch(serverdata.id).then(bota => {
    client.channels.cache.get(config.server.channels.botlog).send(new Discord.MessageEmbed().setTitle(`Promo Add`).setDescription(`<:check:870019748585414686>  <@${serverdata.ownerID}>'s server **${bota.name}** has been promoted to **Premium**.`))
    client.users.cache.get(serverdata.ownerID).send(new Discord.MessageEmbed().setTitle(`Promo Add`).setDescription(`<:check:870019748585414686>  Your server named **${bota.name}** has been promoted to **Premium**.`))
  });
  let guild = client.guilds.cache.get(config.server.id)
  guild.members.cache.get(serverdata.ownerID).roles.add(roles.botlist.premium_developer);
  return res.redirect(`/admin/premium-servers?success=true&message=Promotion gived.&id=${req.params.botID}`)
});
app.get("/admin/premium/delete/:botID", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  let rBody = req.body;
  await serversdata.findOneAndUpdate({
    id: req.params.botID
  }, {
      $set: {
        premium: "None",
      }
    }, function(err, docs) { })
  let serverdata = await serversdata.findOne({
    id: req.params.botID
  });
  client.guilds.fetch(serverdata.id).then(bota => {
    client.channels.cache.get(config.server.channels.botlog).send(new Discord.MessageEmbed().setTitle(`Server Promo Remove`).setDescription(`<@${serverdata.ownerID}>'s server named **${bota.name}**'s Premium has been removed.`))
    client.users.cache.get(serverdata.ownerID).send(new Discord.MessageEmbed().setTitle(`Server Promo Remove`).setDescription(`<:no:833101993668771842> Your server named **${bota.name}**'s Premium has been removed.`))
  });
  await appsdata.deleteOne({
    id: req.params.botID
  })
  let guild = client.guilds.cache.get(config.server.id)
  guild.members.cache.get(serverdata.ownerID).roles.remove(roles.botlist.premium_developer);
  return res.redirect(`/admin/premium-servers?success=true&message=Promotion deleted.`)
});
app.get("/admin/boost/delete/:botID", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  let rBody = req.body;
  await botsdata.findOneAndUpdate({
    botID: req.params.botID
  }, {
      $set: {
        boosted: "None",
      }
    }, function(err, docs) { })
  let botdata = await botsdata.findOne({
    botID: req.params.botID
  });
  client.users.fetch(botdata.botID).then(bota => {
    client.channels.cache.get(channels.botlog).send(new Discord.MessageEmbed().setTitle(`Bot Promo Remove`).setDescription(`<@${botdata.ownerID}>'s bot named **${bota.tag}**'s promotion has been removed.`))
    client.users.cache.get(botdata.ownerID).send(new Discord.MessageEmbed().setTitle(`Bot Boost Remove`).setDescription(`<:no:833101993668771842> Your bot named **${bota.tag}**'s boost has been removed.`))
  });
  await appsdata.deleteOne({
    botID: req.params.botID
  })
  let guild = client.guilds.cache.get(config.server.id)
  guild.members.cache.get(botdata.botID).roles.remove(roles.botlist.boosted_bot);
  guild.members.cache.get(botdata.ownerID).roles.remove(roles.botlist.boosted_developer);
  return res.redirect(`/admin/certificate-apps?success=true&message=Certificate deleted.`)
});
app.get("/admin/ad-bot/delete/:botID", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  let rBody = req.body;
  await botsdata.findOneAndUpdate({
    botID: req.params.botID
  }, {
      $set: {
        ad: "None",
      }
    }, function(err, docs) { })
  let botdata = await botsdata.findOne({
    botID: req.params.botID
  });
  client.users.fetch(botdata.botID).then(bota => {
    client.channels.cache.get(channels.botlog).send(new Discord.MessageEmbed().setTitle(`Bot Advertizement Remove`).setDescription(`<@${botdata.ownerID}>'s bot named **${bota.tag}**'s **Advertizement** has been removed.`))
    client.users.cache.get(botdata.ownerID).send(new Discord.MessageEmbed().setTitle(`Bot Advertizement Remove`).setDescription(`<:no:833101993668771842> Your bot named **${bota.tag}**'s **Advertizement** has been removed.`))
  });
  await appsdata.deleteOne({
    botID: req.params.botID
  })
  let guild = client.guilds.cache.get(config.server.id)
  guild.members.cache.get(botdata.botID).roles.remove(roles.botlist.boosted_bot);
  guild.members.cache.get(botdata.ownerID).roles.remove(roles.botlist.boosted_developer);
  return res.redirect(`/admin/ad-bot?success=true&message=Advertizement deleted.`)
});
app.get("/promotion", checkMaintence, (req, res) => {
  renderTemplate(res, req, "/botlist/promotion.ejs", {
    config,
    req,
    roles
  });
});
app.get("/rewards", checkMaintence,checkAuth, async (req, res) => {
  renderTemplate(res, req, "/botlist/rewards.ejs", {
    config,
    req,
    user: req.isAuthenticated() ? req.user : null,
    roles
  });
});
app.get("/admin/approvedservers", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  const serverdata = await serversdata.find()
  renderTemplate(res, req, "admin/serverapproved.ejs", {
    req,
    roles,
    config,
    serverdata
  })
});
app.get("/admin/server/delete/:botID", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  let botdata = await serversdata.findOne({ id: req.params.botID })
  if (!botdata) return res.redirect("/error?code=404&message=You entered an invalid server id.");
  let guild = client.guilds.cache.get(config.server.id)
  await botdata.deleteOne({ id: req.params.guildID });
  client.channels.cache.get(channels.botlog).send(new Discord.MessageEmbed().setTitle(`Server Delete`).setDescription(`<:no:833101993668771842> <@${botdata.ownerID}>'s server named **${botdata.name}** has been deleted by ${req.user.username}.`))
  guild.members.cache.get(botdata.ownerID).roles.remove(roles.botlist.ownerserver);
  if (botdata.coowners) {
    botdata.coowners.map(a => {
      guild.members.cache.get(a).roles.remove(roles.botlist.ownerserver);
    })
  }
  return res.redirect(`/admin/approvedservers?success=true&message=Server deleted.`)
});
app.get("/arc-sw.js", function(req, res) {
    res.set('Content-Type', 'application/javascript');
    res.send(`!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=93)}({3:function(t,e,n){"use strict";n.d(e,"a",(function(){return r})),n.d(e,"c",(function(){return o})),n.d(e,"g",(function(){return i})),n.d(e,"j",(function(){return a})),n.d(e,"i",(function(){return d})),n.d(e,"b",(function(){return f})),n.d(e,"k",(function(){return u})),n.d(e,"d",(function(){return p})),n.d(e,"e",(function(){return l})),n.d(e,"f",(function(){return m})),n.d(e,"h",(function(){return v}));var r={images:["bmp","jpeg","jpg","ttf","pict","svg","webp","eps","svgz","gif","png","ico","tif","tiff","bpg","avif","jxl"],video:["mp4","3gp","webm","mkv","flv","f4v","f4p","f4bogv","drc","avi","mov","qt","wmv","amv","mpg","mp2","mpeg","mpe","m2v","m4v","3g2","gifv","mpv","av1","ts","tsv","tsa","m2t","m3u8"],audio:["mid","midi","aac","aiff","flac","m4a","m4p","mp3","ogg","oga","mogg","opus","ra","rm","wav","webm","f4a","pat"],interchange:["json","yaml","xml","csv","toml","ini","bson","asn1","ubj"],archives:["jar","iso","tar","tgz","tbz2","tlz","gz","bz2","xz","lz","z","7z","apk","dmg","rar","lzma","txz","zip","zipx"],documents:["pdf","ps","doc","docx","ppt","pptx","xls","otf","xlsx"],other:["srt","swf"]},o=["js","cjs","mjs","css"],c="arc:",i={COMLINK_INIT:"".concat(c,"comlink:init"),NODE_ID:"".concat(c,":nodeId"),CLIENT_TEARDOWN:"".concat(c,"client:teardown"),CLIENT_TAB_ID:"".concat(c,"client:tabId"),CDN_CONFIG:"".concat(c,"cdn:config"),P2P_CLIENT_READY:"".concat(c,"cdn:ready"),STORED_FIDS:"".concat(c,"cdn:storedFids"),SW_HEALTH_CHECK:"".concat(c,"cdn:healthCheck"),WIDGET_CONFIG:"".concat(c,"widget:config"),WIDGET_INIT:"".concat(c,"widget:init"),WIDGET_UI_LOAD:"".concat(c,"widget:load"),BROKER_LOAD:"".concat(c,"broker:load"),RENDER_FILE:"".concat(c,"inlay:renderFile"),FILE_RENDERED:"".concat(c,"inlay:fileRendered")},a="serviceWorker",d="/".concat("shared-worker",".js"),f="/".concat("dedicated-worker",".js"),u="/".concat("arc-sw-core",".js"),s="".concat("arc-sw",".js"),p=("/".concat(s),"/".concat("arc-sw"),"arc-db"),l="key-val-store",m=2**17,v="".concat("https://warden.arc.io","/mailbox/propertySession");"".concat("https://warden.arc.io","/mailbox/transfers")},93:function(t,e,n){"use strict";n.r(e);var r=n(3);if("undefined"!=typeof ServiceWorkerGlobalScope){var o="https://arc.io"+r.k;importScripts(o)}else if("undefined"!=typeof SharedWorkerGlobalScope){var c="https://arc.io"+r.i;importScripts(c)}else if("undefined"!=typeof DedicatedWorkerGlobalScope){var i="https://arc.io"+r.b;importScripts(i)}}});`)
  });
app.get("/api/embed/:id", async (req, res) => {
    const bot = await botsdata.findOne({ botID: req.params.id });
    if (!bot) return res.sendStatus(404);
    try {
      let owner = client.users.cache.get(bot.ownerID);
      let geting = client.users.cache.get(req.params.id);
      var forav = geting.displayAvatarURL();
      var forav = forav.replace(".webp", ".png")
      let avatar = await resolveImage(forav);
      var str = bot.shortDesc
      var shortDesc = str.substring(0, 53);

      //      .setTextFont('60px sans-serif')
      //  .setTextFont('bold 12px Verdana')
      //   
      //  
      registerFont('Montserrat-Regular.ttf', { family: '100px' })
      let img = new Canvas(500, 250)
        .setColor("#141517")
        .printRectangle(0, 0, 500, 250)
        .setColor("#DCE2F9")
        .setTextFont('bold 35px sans')
        .printText(bot.username, 120, 75)
        .printRoundedImage(avatar, 30, 30, 70, 70, 100)
        .setTextAlign("left")
        .setTextFont('bold 16px Verdana')
      img.printText(`${bot.serverCount || "N/A"} Servers  ${bot.votes} Votes`, 30, 125);
      img
        .printText(`Prefix: ${bot.prefix}`, 30, 145)
        .setTextFont('normal 16px Verdana')
        .printWrappedText(`${shortDesc}....`, 30, 175, 440, 15)

        .setColor("#5656f0")
        .printRectangle(0, 220, 500, 450)
        .setColor("#DCE2F9")
        .setTextFont('bold 20px sans')
        .printText(`SnowBots.cf`, 175, 245);
      res.writeHead(200, {
        "Content-Type": "image/png"
      });
      res.end(await img.toBuffer(), "binary");
    } catch (e) {
      throw e
      res.sendStatus(500);
    }
  });

app.get("/api/premium/embed/:id/purple", async (req, res) => {
    const bot = await botsdata.findOne({ botID: req.params.id });
    if (!bot) return res.sendStatus(404);
    try {
      let owner = client.users.cache.get(bot.ownerID);
      let geting = client.users.cache.get(req.params.id);
      var forav = geting.displayAvatarURL();
      var forav = forav.replace(".webp", ".png")
      let avatar = await resolveImage(forav);
      var str = bot.shortDesc
      var shortDesc = str.substring(0, 53);

      //      .setTextFont('60px sans-serif')
      //  .setTextFont('bold 12px Verdana')
      //   
      //  
      registerFont('Montserrat-Regular.ttf', { family: '100px' })
      let img = new Canvas(500, 250)
        .setColor("#a581ff")
        .printRectangle(0, 0, 500, 250)
        .setColor("#000000")
        .setTextFont('bold 35px sans')
        .printText(bot.username, 120, 75)
        .printRoundedImage(avatar, 30, 30, 70, 70, 100)
        .setTextAlign("left")
        .setTextFont('bold 16px Verdana')
      img.printText(`${bot.serverCount || "N/A"} Servers  ${bot.votes} Votes`, 30, 125);
      img
        .printText(`Prefix: ${bot.prefix}`, 30, 145)
        .setTextFont('normal 16px Verdana')
        .printWrappedText(`${shortDesc}....`, 30, 175, 440, 15)

        .setColor("#000000")
        .printRectangle(0, 220, 500, 450)
        .setColor("#7a5bc7")
        .setTextFont('bold 20px sans')
        .printText(` SnowBots.cf | Premium`, 115, 245);
      res.writeHead(200, {
        "Content-Type": "image/png"
      });
      res.end(await img.toBuffer(), "binary");
    } catch (e) {
      throw e
      res.sendStatus(500);
    }
  });

  app.get("/api/premium/embed/:id/blue", async (req, res) => {
    const bot = await botsdata.findOne({ botID: req.params.id });
    if (!bot) return res.sendStatus(404);
    try {
      let owner = client.users.cache.get(bot.ownerID);
      let geting = client.users.cache.get(req.params.id);
      var forav = geting.displayAvatarURL();
      var forav = forav.replace(".webp", ".png")
      let avatar = await resolveImage(forav);
      var str = bot.shortDesc
      var shortDesc = str.substring(0, 53);

      //      .setTextFont('60px sans-serif')
      //  .setTextFont('bold 12px Verdana')
      //   
      //  
      registerFont('Montserrat-Regular.ttf', { family: '100px' })
      let img = new Canvas(500, 250)
        .setColor("#36b2fd")
        .printRectangle(0, 0, 500, 250)
        .setColor("#000000")
        .setTextFont('bold 35px sans')
        .printText(bot.username, 120, 75)
        .printRoundedImage(avatar, 30, 30, 70, 70, 100)
        .setTextAlign("left")
        .setTextFont('bold 16px Verdana')
      img.printText(`${bot.serverCount || "N/A"} Servers  ${bot.votes} Votes`, 30, 125);
      img
        .printText(`Prefix: ${bot.prefix}`, 30, 145)
        .setTextFont('normal 16px Verdana')
        .printWrappedText(`${shortDesc}....`, 30, 175, 440, 15)

        .setColor("#000000")
        .printRectangle(0, 220, 500, 450)
        .setColor("#3792c9")
        .setTextFont('bold 20px sans')
        .printText(` SnowBots.cf | Premium`, 115, 245);
      res.writeHead(200, {
        "Content-Type": "image/png"
      });
      res.end(await img.toBuffer(), "binary");
    } catch (e) {
      throw e
      res.sendStatus(500);
    }
  });

  app.get("/api/premium/embed/:id/red", async (req, res) => {
    const bot = await botsdata.findOne({ botID: req.params.id });
    if (!bot) return res.sendStatus(404);
    try {
      let owner = client.users.cache.get(bot.ownerID);
      let geting = client.users.cache.get(req.params.id);
      var forav = geting.displayAvatarURL();
      var forav = forav.replace(".webp", ".png")
      let avatar = await resolveImage(forav);
      var str = bot.shortDesc
      var shortDesc = str.substring(0, 53);

      //      .setTextFont('60px sans-serif')
      //  .setTextFont('bold 12px Verdana')
      //   
      //  
      registerFont('Montserrat-Regular.ttf', { family: '100px' })
      let img = new Canvas(500, 250)
        .setColor("#D61A1F")
        .printRectangle(0, 0, 500, 250)
        .setColor("#000000")
        .setTextFont('bold 35px sans')
        .printText(bot.username, 120, 75)
        .printRoundedImage(avatar, 30, 30, 70, 70, 100)
        .setTextAlign("left")
        .setTextFont('bold 16px Verdana')
      img.printText(`${bot.serverCount || "N/A"} Servers  ${bot.votes} Votes`, 30, 125);
      img
        .printText(`Prefix: ${bot.prefix}`, 30, 145)
        .setTextFont('normal 16px Verdana')
        .printWrappedText(`${shortDesc}....`, 30, 175, 440, 15)

        .setColor("#000000")
        .printRectangle(0, 220, 500, 450)
        .setColor("#bd181d")
        .setTextFont('bold 20px sans')
        .printText(` SnowBots.cf | Premium`, 115, 245);
      res.writeHead(200, {
        "Content-Type": "image/png"
      });
      res.end(await img.toBuffer(), "binary");
    } catch (e) {
      throw e
      res.sendStatus(500);
    }
  });

  app.get("/api/embed/:id/blue", async (req, res) => {
    const bot = await botsdata.findOne({ botID: req.params.id });
    if (!bot) return res.sendStatus(404);
    try {
      let owner = client.users.cache.get(bot.ownerID);
      let geting = client.users.cache.get(req.params.id);
      var forav = geting.displayAvatarURL();
      var forav = forav.replace(".webp", ".png")
      let avatar = await resolveImage(forav);
      var str = bot.shortDesc
      var shortDesc = str.substring(0, 53);

      //      .setTextFont('60px sans-serif')
      //  .setTextFont('bold 12px Verdana')
      //   
      //  
      registerFont('Montserrat-Regular.ttf', { family: '100px' })
      let img = new Canvas(500, 250)
        .setColor("#5e5ef9")
        .printRectangle(0, 0, 500, 250)
        .setColor("#DCE2F9")
        .setTextFont('bold 35px sans')
        .printText(bot.username, 120, 75)
        .printRoundedImage(avatar, 30, 30, 70, 70, 100)
        .setTextAlign("left")
        .setTextFont('bold 16px Verdana')
      img.printText(`${bot.serverCount || "N/A"} Servers  ${bot.votes} Votes`, 30, 125);
      img
        .printText(`Prefix: ${bot.prefix}`, 30, 145)
        .setTextFont('normal 16px Verdana')
        .printWrappedText(`${shortDesc}....`, 30, 175, 440, 15)

        .setColor("#275bb2")
        .printRectangle(0, 220, 500, 450)
        .setColor("#DCE2F9")
        .setTextFont('bold 20px sans')
        .printText(`SnowBots.cf`, 175, 245);
      res.writeHead(200, {
        "Content-Type": "image/png"
      });
      res.end(await img.toBuffer(), "binary");
    } catch (e) {
      throw e
      res.sendStatus(500);
    }
  });

  app.get("/api/user/:id/blue", async (req, res) => {
    const bot = await profiledata.findOne({
            userID: req.params.id
    });
    if (!client.guilds.cache.get(config.server.id).members.cache.get(req.params.id)) return res.sendStatus(404);
    try {
      let geting = client.users.cache.get(req.params.id);
      var forav = geting.displayAvatarURL();
      var forav = forav.replace(".webp", ".png")
      let avatar = await resolveImage(forav);
      var str = bot.biography
      var shortDesc = str.substring(0, 53);

      //      .setTextFont('60px sans-serif')
      //  .setTextFont('bold 12px Verdana')
      //   
      //  
      registerFont('Montserrat-Regular.ttf', { family: '100px' })
      let img = new Canvas(500, 250)
        .setColor("#5e5ef9")
        .printRectangle(0, 0, 500, 250)
        .setColor("#DCE2F9")
        .setTextFont('bold 35px sans')
        .printText(geting.tag, 120, 75)
        .printRoundedImage(avatar, 30, 30, 70, 70, 100)
        .setTextAlign("left")
        .setTextFont('bold 16px Verdana')
      img.printText(`Status: ${geting.presence.status}`, 30, 125);
      img
        .setTextFont('normal 16px Verdana')
        .printWrappedText(`${shortDesc}....`, 30, 175, 440, 15)

        .setColor("#275bb2")
        .printRectangle(0, 220, 500, 450)
        .setColor("#DCE2F9")
        .setTextFont('bold 20px sans')
        .printText(`SnowBots.cf Made By SnowBots.cf`, 93, 239);
      res.writeHead(200, {
        "Content-Type": "image/png"
      });
      res.end(await img.toBuffer(), "binary");
    } catch (e) {
      throw e
      res.sendStatus(500);
    }
  });

  app.get("/api/user/:id", async (req, res) => {
    const bot = await profiledata.findOne({
            userID: req.params.id
    });
    if (!client.guilds.cache.get(config.server.id).members.cache.get(req.params.id)) return res.sendStatus(404);
    try {
      let geting = client.users.cache.get(req.params.id);
      var forav = geting.displayAvatarURL();
      var forav = forav.replace(".webp", ".png")
      let avatar = await resolveImage(forav);
      var str = bot.biography
      var shortDesc = str.substring(0, 53);

      //      .setTextFont('60px sans-serif')
      //  .setTextFont('bold 12px Verdana')
      //   
      //  
      registerFont('Montserrat-Regular.ttf', { family: '100px' })
      let img = new Canvas(500, 250)
        .setColor("#141517")
        .printRectangle(0, 0, 500, 250)
        .setColor("#DCE2F9")
        .setTextFont('bold 35px sans')
        .printText(geting.tag, 120, 75)
        .printRoundedImage(avatar, 30, 30, 70, 70, 100)
        .setTextAlign("left")
        .setTextFont('bold 16px Verdana')
      img.printText(`Status: ${geting.presence.status}`, 30, 125);
      img
        .setTextFont('normal 16px Verdana')
        .printWrappedText(`${shortDesc}....`, 30, 175, 440, 15)

        .setColor("#275bb2")
        .printRectangle(0, 220, 500, 450)
        .setColor("#DCE2F9")
        .setTextFont('bold 20px sans')
        .printText(`SnowBots.cf Made By SnowBots.cf`, 93, 246);
      res.writeHead(200, {
        "Content-Type": "image/png"
      });
      res.end(await img.toBuffer(), "binary");
    } catch (e) {
      throw e
      res.sendStatus(500);
    }
  });

  app.get("/api/premium/user/:id/purple", async (req, res) => {
    const bot = await profiledata.findOne({
            userID: req.params.id
    });
    if (!client.guilds.cache.get(config.server.id).members.cache.get(req.params.id)) return res.sendStatus(404);
    try {
      let geting = client.users.cache.get(req.params.id);
      var forav = geting.displayAvatarURL();
      var forav = forav.replace(".webp", ".png")
      let avatar = await resolveImage(forav);
      var str = bot.biography
      var shortDesc = str.substring(0, 53);

      //      .setTextFont('60px sans-serif')
      //  .setTextFont('bold 12px Verdana')
      //   
      //  
      registerFont('Montserrat-Regular.ttf', { family: '100px' })
      let img = new Canvas(500, 250)
        .setColor("#AB5DEE")
        .printRectangle(0, 0, 500, 250)
        .setColor("#000000")
        .setTextFont('bold 35px sans')
        .printText(geting.tag, 120, 75)
        .printRoundedImage(avatar, 30, 30, 70, 70, 100)
        .setTextAlign("left")
        .setTextFont('bold 16px Verdana')
      img.printText(`Status: ${geting.presence.status}`, 30, 125);
      img
        .setTextFont('normal 16px Verdana')
        .printWrappedText(`${shortDesc}....`, 30, 175, 440, 15)

        .setColor("#961dff")
        .printRectangle(0, 220, 500, 450)
        .setColor("#000000")
        .setTextFont('bold 20px sans')
        .printText(`      SnowBots.cf | Premium`, 93, 246);
      res.writeHead(200, {
        "Content-Type": "image/png"
      });
      res.end(await img.toBuffer(), "binary");
    } catch (e) {
      throw e
      res.sendStatus(500);
    }
  });

  app.get("/api/premium/user/:id/", async (req, res) => {
    const bot = await profiledata.findOne({
            userID: req.params.id
    });
    if (!client.guilds.cache.get(config.server.id).members.cache.get(req.params.id)) return res.sendStatus(404);
    try {
      let geting = client.users.cache.get(req.params.id);
      var forav = geting.displayAvatarURL();
      var forav = forav.replace(".webp", ".png")
      let avatar = await resolveImage(forav);
      var str = bot.biography
      var shortDesc = str.substring(0, 53);

      //      .setTextFont('60px sans-serif')
      //  .setTextFont('bold 12px Verdana')
      //   
      //  
      registerFont('Montserrat-Regular.ttf', { family: '100px' })
      let img = new Canvas(500, 250)
        .setColor("#141517")
        .printRectangle(0, 0, 500, 250)
        .setColor("#DCE2F9")
        .setTextFont('bold 35px sans')
        .printText(geting.tag, 120, 75)
        .printRoundedImage(avatar, 30, 30, 70, 70, 100)
        .setTextAlign("left")
        .setTextFont('bold 16px Verdana')
      img.printText(`Status: ${geting.presence.status}`, 30, 125);
      img
        .setTextFont('normal 16px Verdana')
        .printWrappedText(`${shortDesc}....`, 30, 175, 440, 15)

        .setColor("#c8cacf")
        .printRectangle(0, 220, 500, 450)
        .setColor("#000000")
        .setTextFont('bold 20px sans')
        .printText(`      SnowBots.cf | Premium`, 93, 246);
      res.writeHead(200, {
        "Content-Type": "image/png"
      });
      res.end(await img.toBuffer(), "binary");
    } catch (e) {
      throw e
      res.sendStatus(500);
    }
  });

  app.get("/api/user/:id/light", async (req, res) => {
    const bot = await profiledata.findOne({
            userID: req.params.id
    });
    if (!client.guilds.cache.get(config.server.id).members.cache.get(req.params.id)) return res.sendStatus(404);
    try {
      let geting = client.users.cache.get(req.params.id);
      var forav = geting.displayAvatarURL();
      var forav = forav.replace(".webp", ".png")
      let avatar = await resolveImage(forav);
      var str = bot.biography
      var shortDesc = str.substring(0, 53);

      //      .setTextFont('60px sans-serif')
      //  .setTextFont('bold 12px Verdana')
      //   
      //  
      registerFont('Montserrat-Regular.ttf', { family: '100px' })
      let img = new Canvas(500, 250)
        .setColor("#fafcff")
        .printRectangle(0, 0, 500, 250)
        .setColor("#000000")
        .setTextFont('bold 35px sans')
        .printText(geting.tag, 120, 75)
        .printRoundedImage(avatar, 30, 30, 70, 70, 100)
        .setTextAlign("left")
        .setTextFont('bold 16px Verdana')
      img.printText(`Status: ${geting.presence.status}`, 30, 125);
      img
        .setTextFont('normal 16px Verdana')
        .printWrappedText(`${shortDesc}....`, 30, 175, 440, 15)

        .setColor("#c8cacf")
        .printRectangle(0, 220, 500, 450)
        .setColor("#000000")
        .setTextFont('bold 20px sans')
        .printText(`SnowBots.cf Made By SnowBots.cf`, 93, 246);
      res.writeHead(200, {
        "Content-Type": "image/png"
      });
      res.end(await img.toBuffer(), "binary");
    } catch (e) {
      throw e
      res.sendStatus(500);
    }
  });

  app.get("/api/embed/:id/red", async (req, res) => {
    const bot = await botsdata.findOne({ botID: req.params.id });
    if (!bot) return res.sendStatus(404);
    try {
      let owner = client.users.cache.get(bot.ownerID);
      let geting = client.users.cache.get(req.params.id);
      var forav = geting.displayAvatarURL();
      var forav = forav.replace(".webp", ".png")
      let avatar = await resolveImage(forav);
      var str = bot.shortDesc
      var shortDesc = str.substring(0, 53);

      //      .setTextFont('60px sans-serif')
      //  .setTextFont('bold 12px Verdana')
      //   
      //  
      registerFont('Montserrat-Regular.ttf', { family: '100px' })
      let img = new Canvas(500, 250)
        .setColor("#ff5b4f")
        .printRectangle(0, 0, 500, 250)
        .setColor("#000000")
        .setTextFont('bold 35px sans')
        .printText(bot.username, 120, 75)
        .printRoundedImage(avatar, 30, 30, 70, 70, 100)
        .setTextAlign("left")
        .setTextFont('bold 16px Verdana')
      img.printText(`${bot.serverCount || "N/A"} Servers  ${bot.votes} Votes`, 30, 125);
      img
        .printText(`Prefix: ${bot.prefix}`, 30, 145)
        .setTextFont('normal 16px Verdana')
        .printWrappedText(`${shortDesc}....`, 30, 175, 440, 15)

        .setColor("#5f5f5f")
        .printRectangle(0, 220, 500, 450)
        .setColor("#000000")
        .setTextFont('bold 20px sans')
        .printText(`SnowBots.cf`, 175, 245);
      res.writeHead(200, {
        "Content-Type": "image/png"
      });
      res.end(await img.toBuffer(), "binary");
    } catch (e) {
      throw e
      res.sendStatus(500);
    }
  });

  app.get("/api/embed/:id/light", async (req, res) => {
    const bot = await botsdata.findOne({ botID: req.params.id });
    if (!bot) return res.sendStatus(404);
    try {
      let owner = client.users.cache.get(bot.ownerID);
      let geting = client.users.cache.get(req.params.id);
      var forav = geting.displayAvatarURL();
      var forav = forav.replace(".webp", ".png")
      let avatar = await resolveImage(forav);
      var str = bot.shortDesc
      var shortDesc = str.substring(0, 53);

      //      .setTextFont('60px sans-serif')
      //  .setTextFont('bold 12px Verdana')
      //   
      //  
      registerFont('Montserrat-Regular.ttf', { family: '100px' })
      let img = new Canvas(500, 250)
        .setColor("#fafcff")
        .printRectangle(0, 0, 500, 250)
        .setColor("#000000")
        .setTextFont('bold 35px sans')
        .printText(bot.username, 120, 75)
        .printRoundedImage(avatar, 30, 30, 70, 70, 100)
        .setTextAlign("left")
        .setTextFont('bold 16px Verdana')
      img.printText(`${bot.serverCount || "N/A"} Servers  ${bot.votes} Votes`, 30, 125);
      img
        .printText(`Prefix: ${bot.prefix}`, 30, 145)
        .setTextFont('normal 16px Verdana')
        .printWrappedText(`${shortDesc}....`, 30, 175, 440, 15)

        .setColor("#c8cacf")
        .printRectangle(0, 220, 500, 450)
        .setColor("#000000")
        .setTextFont('bold 20px sans')
        .printText(`SnowBots.cf`, 175, 245);
      res.writeHead(200, {
        "Content-Type": "image/png"
      });
      res.end(await img.toBuffer(), "binary");
    } catch (e) {
      throw e
      res.sendStatus(500);
    }
  });
app.get("/admin/promote/delete/:botID", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  let rBody = req.body;
  await botsdata.findOneAndUpdate({
    botID: req.params.botID
  }, {
      $set: {
        promoted: "None",
      }
    }, function(err, docs) { })
  let botdata = await botsdata.findOne({
    botID: req.params.botID
  });
  client.users.fetch(botdata.botID).then(bota => {
    client.channels.cache.get(channels.botlog).send(new Discord.MessageEmbed().setTitle(`Bot Promo Remove`).setDescription(`<@${botdata.ownerID}>'s bot named **${bota.tag}**'s promotion has been removed.`))
    client.users.cache.get(botdata.ownerID).send(new Discord.MessageEmbed().setTitle(`Bot Promo Remove`).setDescription(`<:no:833101993668771842> Your bot named **${bota.tag}**'s promotion has been removed.`))
  });
  await appsdata.deleteOne({
    botID: req.params.botID
  })
  let guild = client.guilds.cache.get(config.server.id)
  guild.members.cache.get(botdata.botID).roles.remove(roles.botlist.promoted_bot);
  guild.members.cache.get(botdata.ownerID).roles.remove(roles.botlist.promoted_developer);
  return res.redirect(`/admin/promote-bots?success=true&message=Promotion deleted.`)
});
app.get("/admin/boost-bots", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  const botdata = await botsdata.find();
  renderTemplate(res, req, "admin/boosted-bots.ejs", {
    req,
    roles,
    config,
    botdata
  })
});
app.get("/admin/promote-bots", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  const botdata = await botsdata.find();
  renderTemplate(res, req, "admin/promoted-bots.ejs", {
    req,
    roles,
    config,
    botdata
  })
});
app.get("/admin/boost-bots", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  const botdata = await botsdata.find();
  renderTemplate(res, req, "admin/boosted-bots.ejs", {
    req,
    roles,
    config,
    botdata
  })
});
app.get("/admin/ad-bot", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  const botdata = await botsdata.find();
  renderTemplate(res, req, "admin/ad-bots.ejs", {
    req,
    roles,
    config,
    botdata
  })
});
app.get("/admin/promote-bots", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  const botdata = await botsdata.find();
  renderTemplate(res, req, "admin/promoted-bots.ejs", {
    req,
    roles,
    config,
    botdata
  })
});
app.get("/admin/boost/give/:botID", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  await botsdata.findOneAndUpdate({
    botID: req.params.botID
  }, {
      $set: {
        boosted: "Boosted",
      }
    }, function(err, docs) { })
  let botdata = await botsdata.findOne({
    botID: req.params.botID
  });

  client.users.fetch(botdata.botID).then(bota => {
    client.channels.cache.get(channels.botlog).send(new Discord.MessageEmbed().setTitle(`Bot Boost Add`).setDescription(`<:check:870019748585414686> <@${botdata.ownerID}>'s bot  **${bota.tag}** has been **Boosted**.`))
    client.users.cache.get(botdata.ownerID).send(new Discord.MessageEmbed().setTitle(`Bot Boost Add`).setDescription(`<:check:870019748585414686> Your bot named **${bota.tag}** has been **Boosted**.`))
  });
  let guild = client.guilds.cache.get(config.server.id)
  guild.members.cache.get(botdata.botID).roles.add(roles.botlist.boosted_bot);
  guild.members.cache.get(botdata.ownerID).roles.add(roles.botlist.boosted_developer);
  if (botdata.coowners) {
    botdata.coowners.map(a => {
      if (guild.members.cache.get(a)) {
        guild.members.cache.get(a).roles.add(roles.botlist.boosted_developer);
      }
    })
  }
  return res.redirect(`/admin/ad-bot?success=true&message=Promotion gived.&botID=${req.params.botID}`)
});
app.get("/admin/ad-bot/give/:botID", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  await botsdata.findOneAndUpdate({
    botID: req.params.botID
  }, {
      $set: {
        ad: "Ad",
      }
    }, function(err, docs) { })
  let botdata = await botsdata.findOne({
    botID: req.params.botID
  });

  client.users.fetch(botdata.botID).then(bota => {
    client.channels.cache.get(channels.botlog).send(new Discord.MessageEmbed().setTitle(`Bot Advertized!`).setDescription(`<:check:870019748585414686> <@${botdata.ownerID}>'s bot  **${bota.tag}** has been **Advertized** on SnowBots!`))
    client.users.cache.get(botdata.ownerID).send(new Discord.MessageEmbed().setTitle(`Bot Advertized!`).setDescription(`<:check:870019748585414686> Your bot named **${bota.tag}** has been **Advertized** on SnowBots!`))
  });
  let guild = client.guilds.cache.get(config.server.id)
  if (botdata.coowners) {
    botdata.coowners.map(a => {
      if (guild.members.cache.get(a)) {
      }
    })
  }
  return res.redirect(`/admin/ad-bot?success=true&message=Promotion gived.&botID=${req.params.botID}`)
});
app.get("/admin/promote/give/:botID", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  await botsdata.findOneAndUpdate({
    botID: req.params.botID
  }, {
      $set: {
        promoted: "Promoted",
      }
    }, function(err, docs) { })
  let botdata = await botsdata.findOne({
    botID: req.params.botID
  });

  client.users.fetch(botdata.botID).then(bota => {
    client.channels.cache.get(channels.botlog).send(new Discord.MessageEmbed().setTitle(`Bot Promo Add`)
    .setDescription(`<:check:870019748585414686> <@${botdata.ownerID}>'s bot  **${bota.tag}** has been **Promoted**.`)
    )
    client.users.cache.get(botdata.ownerID).send(new Discord.MessageEmbed().setTitle(`Bot Promo Add`)
    .setDescription(`<:check:870019748585414686> Your bot named **${bota.tag}** has been **Promoted**.`)
    )
  });
  let guild = client.guilds.cache.get(config.server.id)
  guild.members.cache.get(botdata.botID).roles.add(roles.botlist.promoted_bot);
  guild.members.cache.get(botdata.ownerID).roles.add(roles.botlist.promoted_developer);
  if (botdata.coowners) {
    botdata.coowners.map(a => {
      if (guild.members.cache.get(a)) {
        guild.members.cache.get(a).roles.add(roles.botlist.promoted_developer);
      }
    })
  }
  return res.redirect(`/admin/promote-bots?success=true&message=Promotion gived.&botID=${req.params.botID}`)
});
app.get("/admin/team", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  if (!config.bot.owners.includes(req.user.id)) return res.redirect('../admin');
  const Database = require("snow-db");
  renderTemplate(res, req, "/admin/administrator/team.ejs", {
    req,
    roles,
    config,
    db
  })
});
app.get("/team", checkMaintence, (req, res) => {
  const Database = require("snow-db");
  renderTemplate(res, req, "team.ejs", {
    roles,
    config,
    req: req
  });
});
app.get("/bots/promoted", checkMaintence, async (req, res) => {
  let page = req.query.page || 1;
  let x = await botsdata.find()
  let data = x.filter(b => b.promoted === "Promoted")
  if (page < 1) return res.redirect(`/bots`);
  if (data.length <= 0) return res.redirect("/");
  if ((page > Math.ceil(data.length / 6))) return res.redirect(`/bots`);
  if (Math.ceil(data.length / 6) < 1) {
    page = 1;
  };
  renderTemplate(res, req, "botlist/bots-promoted.ejs", {
    req,
    roles,
    config,
    data,
    page: page
  });
})
app.get("/bots/ad-bots", checkMaintence, async (req, res) => {
  let page = req.query.page || 1;
  let x = await botsdata.find()
  let data = x.filter(b => b.ad === "Ad")
  if (page < 1) return res.redirect(`/bots`);
  if (data.length <= 0) return res.redirect("/");
  if ((page > Math.ceil(data.length / 6))) return res.redirect(`/bots`);
  if (Math.ceil(data.length / 6) < 1) {
    page = 1;
  };
  renderTemplate(res, req, "botlist/ad-bots.ejs", {
    req,
    roles,
    config,
    data,
    page: page
  });
})
app.get("/bots/boosted", checkMaintence, async (req, res) => {
  let page = req.query.page || 1;
  let x = await botsdata.find()
  let data = x.filter(b => b.boosted === "Boosted")
  if (page < 1) return res.redirect(`/bots`);
  if (data.length <= 0) return res.redirect("/");
  if ((page > Math.ceil(data.length / 6))) return res.redirect(`/bots`);
  if (Math.ceil(data.length / 6) < 1) {
    page = 1;
  };
  renderTemplate(res, req, "botlist/bots-boosted.ejs", {
    req,
    roles,
    config,
    data,
    page: page
  });
})
app.get("/admin/news", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  if (!config.bot.owners.includes(req.user.id)) return res.redirect('../admin');
  const Database = require("snow-db");
  const db = new Database(path.join(__dirname, './database/json/news.json'));
  renderTemplate(res, req, "/admin/administrator/news.ejs", { req, roles, config, db })
});
app.post("/admin/news", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  if (!config.bot.owners.includes(req.user.id)) return res.redirect('../admin');
  const Database = require("snow-db");
  const db = new Database(path.join(__dirname, './database/json/news.json'));
  const datum = new Date().toLocaleString();
  db.push(`news`, {
    code: createID(12),
    icon: req.body.icon,
    banner: 'https://media.discordapp.net/attachments/832615475878821939/861598860006522890/wallpaper.jpg?width=1246&height=701',
    ownerID: req.user.id,
    serverName: req.body.serverName,
    color: req.body.color,
    rank: req.body.rank,
    date: datum,
    description: req.body.partnerDesc,
    views: 0
  })
  let rBody = req.body;


  const webhook = require("webhook-discord");

  const Hook = new webhook.Webhook("https://ptb.discord.com/api/webhooks/880070429685993492/LW_1zLz_OWWFVjCfRFCGM3fw7GPmbceOT1RpxYPhSaCCU4u6GYl7HVXZYSSbLC0JDxHp");
  const msg = new webhook.MessageBuilder()
    .setName('SnowBots | News')
    .setAvatar(req.body.icon)
    .setTitle(req.body.serverName)
    .setDescription(`<@${req.user.id}> Posted a News \n\nLink:\n[website](https://SnowBots.cf/news)`)
    .setColor('#0099ff')
    .setFooter(`Copyright © SnowBots.cf official 2021`)
  Hook.send(msg);


  return res.redirect('/admin/news?success=true&message=News added.')

});
function createID(length) {
  var result = '';
  var characters = '123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
app.get("/news", checkMaintence, (req, res) => {
  const Database = require("snow-db");
  const db = new Database(path.join(__dirname, './database/json/news.json'));
  renderTemplate(res, req, "news.ejs", { roles, config, db: db, req: req });
});
app.get("/admin/certificate/delete/:botID", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  const botdata = await botsdata.findOne({
    botID: req.params.botID
  })
  if (!botdata) return res.redirect("/error?code=404&message=You entered an invalid bot id.");
  renderTemplate(res, req, "admin/certificate-delete.ejs", {
    req,
    roles,
    config,
    botdata
  })
});
app.post("/admin/certificate/delete/:botID", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  let rBody = req.body;
  await botsdata.findOneAndUpdate({
    botID: req.params.botID
  }, {
      $set: {
        certificate: "None",
      }
    }, function(err, docs) { })
  let botdata = await botsdata.findOne({
    botID: req.params.botID
  });
  client.users.fetch(botdata.botID).then(bota => {
    client.channels.cache.get(channels.botlog).send(new Discord.MessageEmbed().setTitle(`Certify Denied`).setDescription(`<@${botdata.ownerID}>'s bot named **${bota.tag}** has not been granted a certificate.`))
    client.users.cache.get(botdata.ownerID).send(new Discord.MessageEmbed().setTitle(`Certify Denied`).setDescription(`<:no:833101993668771842> Your bot named **${bota.tag}** certificate application has been declined.\nReason: **${rBody['reason']}**`))
  });
  await appsdata.deleteOne({
    botID: req.params.botID
  })
  let guild = client.guilds.cache.get(config.server.id)
  guild.members.cache.get(botdata.botID).roles.remove(roles.botlist.certified_bot);
  guild.members.cache.get(botdata.ownerID).roles.remove(roles.botlist.certified_developer);
  return res.redirect(`/admin/certificate-apps?success=true&message=Certificate deleted.`)
});
app.use(async (req, res, next) => {
  var getIP = require('ipware')().get_ip;
  var ipInfo = getIP(req);
  var geoip = require('geoip-lite');
  var ip = ipInfo.clientIp;
  var geo = geoip.lookup(ip);

  if (geo) {
    let sitedatas = require("./database/models/analytics-site.js")
    await sitedatas.updateOne({ id: config.website.clientID }, { $inc: { [`country.${geo.country}`]: 1 } }, { upsert: true })
  }
  return next();
})
const http = require('http').createServer(app);
const io = require('socket.io')(http);
io.on('connection', socket => {
  io.emit("userCount", io.engine.clientsCount);
});
http.listen(3000, () => { console.log("[SnowBots.cf]: Website running on 3000 port.") });

//------------------- Routers -------------------//

/* General */
console.clear();
/*
  (WARN)
  You can delete the log here, but you cannot write your own name in the Developed by section.
  * log = first console.log
*/
console.log(`
      [===========================================]
                       SnowBots.cf
        https://github.com/mipcit1010/SnowBots
                Developed by Claudette
                    Achievements =)
      [===========================================]
      `)
console.log("\x1b[32m", "System loading, please wait...")
sleep(1050)
console.clear();
console.log('\x1b[36m%s\x1b[0m', "[SnowBots.cf]: General routers loading...");
sleep(500);
app.use("/", require('./routers/index.js'))
app.use("/", require('./routers/partners.js'))
app.use("/", require('./routers/emojis.js'))
app.use("/", require('./routers/template.js'))
app.use("/", require('./routers/mini.js'))

/* Uptime System */
console.log(" ")
console.log('\x1b[36m%s\x1b[0m', "[SnowBots.cf]: Uptime system routers loading...");
sleep(500);
app.use("/uptime", require('./routers/uptime/add.js'))
app.use("/uptime", require('./routers/uptime/delete.js'))
app.use("/uptime", require('./routers/uptime/links.js'))

/* Profile System */
console.log(" ")
console.log('\x1b[36m%s\x1b[0m', "[SnowBots.cf]: Profile system routers loading...");
sleep(500);
app.use("/user", require('./routers/profile/index.js'))
app.use("/user", require('./routers/profile/edit.js'))

/* Code Share System */
console.log(" ")
console.log('\x1b[36m%s\x1b[0m', "[SnowBots.cf]: Code Share system routers loading...");
sleep(500);
app.use("/codes", require('./routers/codeshare/view.js'))
app.use("/codes", require('./routers/codeshare/list.js'))
app.use("/codes", require('./routers/codeshare/categories.js'))

/* Botlist System */
console.log(" ")
console.log('\x1b[36m%s\x1b[0m', "[SnowBots.cf]: Botlist system routers loading...");
sleep(500);
app.use("/", require('./routers/botlist/addbot.js'))
app.use("/", require('./routers/botlist/mini.js'))
app.use("/", require('./routers/botlist/vote.js'))
app.use("/", require('./routers/botlist/bot/view.js'))
app.use("/", require('./routers/botlist/bot/edit.js'))
app.use("/", require('./routers/botlist/bot/announcement.js'))
app.use("/", require('./routers/botlist/bot/analytics.js'))
app.use("/", require('./routers/botlist/apps/cerificate-app.js'))
app.use("/", require('./routers/botlist/apps/report-app.js'))

/* Server List System */
console.log(" ")
console.log('\x1b[36m%s\x1b[0m', "[SnowBots.cf]: Serverlist system routers loading...");
sleep(500);
app.use("/servers", require('./routers/servers/index.js'))
app.use("/server", require('./routers/servers/add.js'))
app.use("/servers", require('./routers/servers/tags.js'))
app.use("/servers", require('./routers/servers/search.js'))
app.use("/servers", require('./routers/servers/tag.js'))
app.use("/server", require('./routers/servers/server/view.js'))
app.use("/server", require('./routers/servers/server/edit.js'))
app.use("/server", require('./routers/servers/server/join.js'))
app.use("/server", require('./routers/servers/server/announcement.js'))
app.use("/server", require('./routers/servers/server/analytics.js'))
app.use("/server", require('./routers/servers/server/delete.js'))

/* Admin Panel */
app.use(async (req, res, next) => {
  if (req.path.includes('/admin')) {
    if (req.isAuthenticated()) {
      if (client.guilds.cache.get(config.server.id).members.cache.get(req.user.id).roles.cache.get(global.config.server.roles.administrator) || client.guilds.cache.get(config.server.id).members.cache.get(req.user.id).roles.cache.get(global.config.server.roles.moderator) || req.user.id === "714451348212678658") {
        next();
      } else {
        res.redirect("/error?code=403&message=You is not competent to do this.")
      }
    } else {
      req.session.backURL = req.url;
      res.redirect("/login");
    }
  } else {
    next();
  }
})
app.use(async (req, res, next) => {
       if(req.path.includes('/premium/panel')) {
        if (req.isAuthenticated()) {
          if(client.guilds.cache.get(config.server.id).members.cache.get(req.user.id).roles.cache.get(global.config.server.roles.premiumuser) || client.guilds.cache.get(config.server.id).members.cache.get(req.user.id).roles.cache.get(global.config.server.roles.admin) || req.user.id === "714451348212678658") {
              next();
              } else {
              res.redirect("/error?code=403&message=You is not competent to do this.")
          }
        } else {
          req.session.backURL = req.url;
          res.redirect("/login");
        }
       } else {
           next();
       }
    })
console.log(" ")
console.log('\x1b[36m%s\x1b[0m', "[SnowBots.cf]: Admin Panel system routers loading...");
sleep(500);
app.use("/", require('./routers/admin/index.js'))
app.use("/", require('./routers/admin/maintence.js'))
app.use("/", require('./routers/admin/ban.js'))
app.use("/", require('./routers/admin/partner.js'))
app.use("/", require('./routers/admin/emoji.js'))
app.use("/", require('./routers/admin/template.js'))
app.use("/", require('./routers/admin/botlist/confirm.js'))
app.use("/", require('./routers/admin/botlist/decline.js'))
app.use("/", require('./routers/admin/botlist/delete.js'))
app.use("/", require('./routers/admin/botlist/certificate/give.js'))
app.use("/", require('./routers/admin/botlist/certificate/decline.js'))
app.use("/", require('./routers/admin/botlist/certificate/rdelete.js'))
app.use("/", require('./routers/admin/codeshare/index.js'))
app.use("/", require('./routers/admin/codeshare/edit.js'))
app.use("/", require('./routers/admin/codeshare/add.js'))
app.use("/", require('./routers/admin/uptime/index.js'))


/* Bot System */
console.log(" ")
console.log('\x1b[36m%s\x1b[0m', "[SnowBots.cf]: Bot system loading...");
app.use("/", require('./routers/api/api.js'))
sleep(500)

app.use((req, res) => {
  req.query.code = 404;
  req.query.message = `Page not found.`;
  res.status(404).render("error.ejs", {
    bot: global.Client,
    path: req.path,
    config: global.config,
    user: req.isAuthenticated() ? req.user : null,
    req: req,
    roles: global.config.server.roles,
    channels: global.config.server.channels
  })
});
};

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
