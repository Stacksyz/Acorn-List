const app = require('express').Router();
const Database = require("snow-db");
const path = require("path")
const db = new Database(path.join(__dirname, '../database/json/partners.json'));

console.log("[Acorn.ink]: Partners router loaded.");

app.get("/partners", async (req,res) => {
    res.render("partners.ejs", {
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