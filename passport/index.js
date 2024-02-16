const passport = require("passport");
const local = require("./localStrategy");
const { readDB } = require("../controller/db");

module.exports = () => {
  passport.serializeUser(function (user, cb) {
    try {
      return cb(null, user.userid);
    } catch (err) {
      return cb(err);
    }
  });
  passport.deserializeUser(async function (id, cb) {
    try {
      const data = await readDB("userData", "users", { userid: id }, false);
      return cb(null, data);
    } catch (err) {
      return cb(err);
    }
  });
  local();
};
