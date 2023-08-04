const { Router } = require("express");
const getLogger = require("./factory");

const router = Router();

const logger = getLogger();

router.get("/", (req, res) => {
  logger.debug(
    "Debug: este es un mensaje de prueba en el endpoint /loggerTest"
  );
  logger.http("HTTP: se ha recibido una solicitud en el endpoint /loggerTest");
  logger.info(
    "Info: este es un mensaje de información en el endpoint /loggerTest"
  );
  logger.warning(
    "Warning: este es un mensaje de advertencia en el endpoint /loggerTest"
  );
  logger.error("Error: este es un mensaje de error en el endpoint /loggerTest");
  logger.fatal("Fatal: este es un mensaje fatal en el endpoint /loggerTest");

  res.json({ message: "Logs generados en el endpoint /loggerTest" });
});

module.exports = router;
