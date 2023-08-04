const winston = require("winston");
const customLevelOptions = require("../utils/customLevelOptions");

const logger = winston.createLogger({
  //levels: customLevelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      /* format: winston.format.combine(
        winston.format.colorize({ colors: customLevelOptions.colors }),
        winston.format.simple()
      ), */
    }),
  ],
});
// cuando quiero implementar los colores no me muestra nada en la consola y nose porque
module.exports = logger;
