const getLogger = require("../logger/factory");

const addLogger = async (req, res, next) => {
  req.logger = await getLogger();

  req.logger.http(
    `${req.method} en ${req.url} = ${new Date().toLocaleTimeString()}`
  );
  next();
};

module.exports = addLogger;
