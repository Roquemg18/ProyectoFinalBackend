const cartsController = require("../carts/controller.carts");
const productsController = require("../products/controller.products");
const messagesController = require("../messages/controller.messages");
const authController = require("../auth/controller.auth");
const usersController = require("../users/controller.users");
const viewsTemplateController = require("../viewsTemplate/controller.viewsTemplate");
const sessionsController = require("../sessions/controller.sessions");
const mockingController = require("../mocking/mocking.controller");
const loggerTestController = require("../logger/logger.controller");

const router = (app) => {
  app.use("/api/carts", cartsController);
  app.use("/api/products", productsController);
  app.use("/api/messages", messagesController);
  app.use("/", viewsTemplateController);
  app.use("/api/users", usersController);
  app.use("/api/auth", authController);
  app.use("/api/sessions", sessionsController);
  app.use("/api/mockingproducts", mockingController);
  app.use("/api/loggertest", loggerTestController);
};

module.exports = router;
