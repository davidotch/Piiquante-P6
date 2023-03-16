const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowsMs: 10 * 60 * 1000,
    max: 10,
});

module.exports = { limiter: limiter };