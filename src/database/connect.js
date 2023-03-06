const config = require("../../config.js");
const mongoose = require("mongoose")

module.exports = async () => {
    mongoose.connect(process.env.MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        autoIndex: false
    }).then(() => {
    console.log("[Acorn.ink]: Mongoose successfully connected.");
    }).catch(err => console.log("[Acorn.ink]: An error occurred while connecting mongoose.", err));
}