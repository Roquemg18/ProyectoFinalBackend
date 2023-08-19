const winston = require("winston");
const customLevelOptions = require("../utils/customLevelOptions");

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "debug",
    }),
  ],
});

module.exports = logger;
