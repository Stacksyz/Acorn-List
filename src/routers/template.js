const app = require('express').Router();
const Database = require("snow-db");
const path = require("path")
const db = new Database(path.join(__dirname, '../database/json/template.json'));

console.log("[SnowBots.cf]: Templates router loaded.");

app.get("/templates", async (req,res) => {
    res.render("template.ejs", {
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