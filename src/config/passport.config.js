const passport = require("passport");
const local = require("passport-local");
const GithubStrategy = require("passport-github2");
const Users = require("../dao/models/users.model");
const { createHash, passwordValidate } = require("../utils/cryptPassword.util");

const {
  clientId,
  clientSecret,
  callbackURL,
} = require("../config/github.config");
const UserDTO = require("../DTOs/users.dto");

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const { email } = req.body;

          const user = await Users.findOne({ email: username });
          if (user) {
            console.log("User already exists");
            return done(null, false);
          }
          const newUserInfo = new UserDTO(req.body);

          const newUser = await Users.create(newUserInfo);
          done(null, newUser);
        } catch (error) {
          done(error);
        }
      }
    )
  );
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await Users.findOne({ email: username });
          if (!user) {
            console.log("el usuario no existe");
            return done(null, false);
          }

          if (!passwordValidate(password, user)) {
            return done(null, false);
          }

          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);

          const user = await Users.findOne({ email: profile._json.email });

          if (!user) {
            const newUserInfo = {
              first_name: profile._json.name,
              last_name: "",
              age: 18,
              email: profile._json.email,
              password: "",
            };
            const newUser = await Users.create(newUserInfo);
            return done(null, newUser);
          }

          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await Users.findById(id);
    done(null, user);
  });
};
module.exports = initializePassport;
