const { Strategy } = require("passport-local"),
  bcrypt = require("bcrypt");

const { getUserByEmail, getUserById } = require("../models/user");

module.exports = (passport) => {
  passport.use(
    new Strategy({ usernameField: "email" }, (email, password, done) => {
      getUserByEmail(email)
        .then((user) => {
          if (!user)
            return done(null, false, { message: "No user found", code: 404 });

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, {
                message: "Wrong password",
                code: 401,
              });
            }
          });
        })
        .catch((err) => {
          console.error(err);
        });
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    getUserById(id, (err, user) => done(err, user));
  });
};
