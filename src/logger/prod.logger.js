const winston = require("winston");
const customLevelOptions = require("../utils/customLevelOptions");

const logger = winston.createLogger({

  transports: [
    new winston.transports.Console({
      level: "info",
     
    }),
    new winston.transports.File({
      filename: "errors.log",
      level: "error",
      format: winston.format.simple(),
    }),
  ],
});

module.exports = logger;
