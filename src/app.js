const express = require("express");
const handlebars = require("express-handlebars");
const mongoConnect = require("../db");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const router = require("./router");
const initializePassport = require("./config/passport.config");
const passport = require("passport");
const compression = require("express-compression");
const errorHandler = require("./middlewares/errors.middleware");
const addLogger = require("./middlewares/logger.middleware");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");

const app = express();

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion de AdoptMe",
      description: "la documentacion de los enpoins",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);
app.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use(addLogger);
app.use(cookieParser());
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://RoqueMolina:dyvhJb7EFKsGBJom@cluster0.tzihxes.mongodb.net/?retryWrites=true&w=majority",
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    }),
    secret: "coderSecret",
    resave: false,
    saveUninitialized: false,
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(
  compression({
    brotli: { enable: true, zlib: {} },
  })
);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");

mongoConnect();
router(app);
app.use(errorHandler);
module.exports = app;
