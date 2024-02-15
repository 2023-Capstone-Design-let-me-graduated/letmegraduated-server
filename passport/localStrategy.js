const bcrypt = require("bcrypt");
const passport = require("passport");
const localStrategy = require("passport-local");
const { readDB } = require("../controller/db");

module.exports = () => {
  passport.use(
    new localStrategy(async function verify(userid, password, cb) {
      try {
        const user = readDB("userData", "users", { userid: userid }, false);
        if (!user.userid) {
          return cb(null, false);
        }
        await bcrypt.compare(password, user.password, function (err, result) {
          if (result !== undefined) {
            return cb(null, user);
          }
        });
      } catch (err) {
        return cb(err);
      }
    })
  );
};
