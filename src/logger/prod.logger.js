const winston = require("winston");
const customLevelOptions = require("../utils/customLevelOptions");

const logger = winston.createLogger({
  //levels: customLevelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      /* format: winston.format.combine(
        winston.format.colorize({ colors: customLevelOptions.colors }),
        winston.format.simple()
      ), */
    }),
    new winston.transports.File({
      filename: "errors.log",
      level: "error",
      format: winston.format.simple(),
    }),
  ],
});

module.exports = logger;
