const passport = require('passport');
const local = require('./localStrategy');
const { readDB } = require('../controller/db');

module.exports = () => {
  passport.serializeUser(function (user, cb){
    process.nextTick(function(){
      return cb(null,user.userid);
    })
  })
  passport.deserializeUser(function (id, cb) {
    const data = readDB('userData','users',{userid:id},false);
    return cb(null,data);
  });
  local();
};