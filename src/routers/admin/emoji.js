const app = require('express').Router();
const channels = global.config.server.channels,
      roles = global.config.server.roles;
const client = global.Client;
const path = require("path");

console.log("[SnowBots.cf]: Admin/Emoji router loaded.");
function createID(length) {
    var result = '';
    var characters = '123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
app.get("/addemoji", global.checkAuth, async (req, res) => {

    const Database = require("snow-db");
    const db = new Database(path.join(__dirname, '../../database/json/emojis.json'));
	res.render("botlist/emoji.ejs", {
	    bot: global.Client,
	    path: req.path,
	    config: global.config,
	    user: req.isAuthenticated() ? req.user : null,
	    req: req,
	    roles:global.config.server.roles,
	    channels: global.config.server.channels,
	    db: db
	 })
});
app.post("/addemoji", global.checkAuth, async (req, res) => {

    const Database = require("snow-db");
    const db = new Database(path.join(__dirname, '../../database/json/emojis.json'));
    db.push(`emojis`, {
            code: createID(12),
            icon: req.body.icon,
            ownerID: req.body.ownerID,
            serverName: req.body.serverName,
            website: req.body.Website,
            background: req.body.background,
            description: req.body.partnerDesc
    })

    return res.redirect('/addemoji?success=true&message=Emoji added. Wait for the web owner to restart the web and your emoji will be placed!')
});

module.exports = app;