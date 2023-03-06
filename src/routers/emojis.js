const app = require('express').Router();
const Database = require("snow-db");
const path = require("path")
const db = new Database(path.join(__dirname, '../database/json/emojis.json'));

console.log("[SnowBots.cf]: Emojis router loaded.");

app.get("/emojis", async (req,res) => {
    res.render("emojis.ejs", {
    	bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        db: db,
        roles: global.config.server.roles
    })
})

module.exports = app;