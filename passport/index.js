const passport = require('passport');
const local = require('./localStrategy');
const { readDB } = require('../controller/db');

module.exports = () => {
  passport.serializeUser(async (user, cb) => {
    
  })
  passport.deserializeUser(function (user, cb) {
    return cb(null,user);
  });
  local();
};