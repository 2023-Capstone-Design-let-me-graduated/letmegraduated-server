const bcrypt = require('bcrypt');
const passport = require('passport');
const localStrategy=require('passport-local');

module.exports=()=>{
    passport.use(new localStrategy())
}