const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

const { pool } = require("./database");

module.exports = session({
    store: new pgSession({
        pool: pool,
        createTableIfMissing: true,
    }),

    secret: process.env.SESSION_SECRET,

    resave: false,
    saveUninitialized: false,

    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
    },
});