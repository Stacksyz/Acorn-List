const app = require('express').Router();
const client = global.Client;
const botsdata = require("../database/models/botlist/bots.js");

console.log("[SnowBots.cf]: Mini pages router loaded.");

app.get("/error", async (req,res) => {
    res.render("error.ejs", {
    	bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        roles:global.config.server.roles,
        channels: global.config.server.channels
    })
})

app.get("/bugreport", async (req,res) => {
    res.render("botlist/bugreport.ejs", {
        bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        roles:global.config.server.roles,
        channels: global.config.server.channels
    })
})

app.get("/banappeal", async (req,res) => {
    res.render("botlist/banappeal.ejs", {
        bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        roles:global.config.server.roles,
        channels: global.config.server.channels
    })
})

app.get("/applypartnership", async (req,res) => {
    res.render("botlist/apppartner.ejs", {
        bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        roles:global.config.server.roles,
        channels: global.config.server.channels
    })
})

app.get("/premium/panel", global.checkAuth, async (req,res) => {
    let user = req.user;
    let guild = client.guilds.cache.get("860627883731320862");
    let checkUser = guild.members.cache.get(user.id);
    if(!checkUser) return res.redirect('/premium?error=true&message=You are not a premium User!');
    let checkRole = checkUser.roles.cache.get("878050906585825341");
    if(!checkRole) return res.redirect('/premium?error=true&message=You are not a premium User!');
    res.render("botlist/premiumpanel.ejs", {
        bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        roles:global.config.server.roles,
        channels: global.config.server.channels
    })
})

app.get("/premium", async (req,res) => {
    res.render("botlist/premium.ejs", {
        bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        roles:global.config.server.roles,
        channels: global.config.server.channels
    })
})

app.get("/theme", async (req,res) => {
    res.render("botlist/theme.ejs", {
        bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        roles:global.config.server.roles,
        channels: global.config.server.channels
    })
})

app.get("/faq", async (req,res) => {
    res.render("botlist/faq.ejs", {
        bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        roles:global.config.server.roles,
        channels: global.config.server.channels
    })
})

app.get("/botlist/ban-appeal-app", async (req,res) => {
    res.render("botlist/appeal.ejs", {
        bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        roles:global.config.server.roles,
        channels: global.config.server.channels
    })
})



app.get("/review-app", async (req,res) => {
    res.render("botlist/reviewapp.ejs", {
        bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        roles:global.config.server.roles,
        channels: global.config.server.channels
    })
})


app.get("/all-faq", async (req,res) => {
    res.render("botlist/all-faq.ejs", {
        bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        roles:global.config.server.roles,
        channels: global.config.server.channels
    })
})

app.get("/status", async (req,res) => {
    res.render("botlist/status.ejs", {
        bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        roles:global.config.server.roles,
        channels: global.config.server.channels
    })
})

app.get("/uneed2login", async (req,res) => {
    res.render("botlist/login.ejs", {
        bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        roles:global.config.server.roles,
        channels: global.config.server.channels
    })
})

app.get("/bot-rules", async (req,res) => {
    res.render("botlist/bot-rules.ejs", {
        bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        roles:global.config.server.roles,
        channels: global.config.server.channels
    })
})

app.get("/dc", async (req,res) => {
    res.redirect(global.config.server.invite)
})
app.get("/vanity/:username", async (req,res) => {
    let botdata = await botsdata.findOne({
      vanity: req.params.username
    });
    res.redirect('https://SnowBots.cf/bot/'+botdata.botID)
})
app.get("/dsl", async (req,res) => {
    res.redirect(global.config.server.dslinvite)
})
app.get("/dbl", async (req,res) => {
    res.redirect(global.config.server.dslinvite)
})
app.get("/discord", async (req,res) => {
    res.redirect(global.config.server.dblinvite)
})

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

module.exports = app;