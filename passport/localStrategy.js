const bcrypt = require("bcrypt");
const passport = require('passport');
const localStrategy = require("passport-local");
const { readDB } = require("../controller/db");

module.exports = () => {
  passport.use(
    new localStrategy(async function verify(username, password, cb) {
      try {
        const user = await readDB("userData", "users", { userid: username }, false);
        if (!user) {
          return cb(null, false);
        }
        await bcrypt.compare(password, user.password, function (err, result) {
          if (result) {
            return cb(null, user);
          }else{
            return cb(null,false); 
          }
        });
      } catch (err) {
        return cb(err);
      }
    })
  );
};