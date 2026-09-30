const rateLimit = require("express-rate-limit");

const authLimiter =
    process.env.NODE_ENV === "test"
        ? (req, res, next) => next()
        : rateLimit({
              windowMs: 15 * 60 * 1000, // 15 minutes

              max: 500,

              message: {
                  success: false,
                  message: "Too many requests. Please try again later.",
              },

              standardHeaders: true,
              legacyHeaders: false,
          });

module.exports = {
    authLimiter,
};