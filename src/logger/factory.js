const appConfig = require("../config/app.config");

function getLogger() {
  let logger;
  switch (appConfig) {
    case "development":
      console.log("dev");
      logger = require("./dev.logger");
      break;
    case "production":
      console.log("prod");
      logger = require("./prod.logger");
      break;
    default:
      // Manejar un valor de appConfig no válido o proporcionar un logger por defecto
      logger = require("./dev.logger");
      break;
  }
  return logger;
}

module.exports = getLogger;
