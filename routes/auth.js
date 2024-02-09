const express = require('express');
const { emailForSignUp, emailForWithdrawal } = require("../controller/email");
const router = express.Router();
const { deleteDB, readDB } = require('../controller/db');
var passport = require('passport');
var LocalStrategy = require('passport-local');
const { creatUser } = require('../controller/auth');

// /signup/useremail
// emailForSignUp으로 res.send(해줘야함.)
router.get("/signup", emailForSignUp, (req, res) => res.send(req.secret));

// /signup
// createUser
router.post('/signup', creatUser);

// /login
// query: userid랑 passward받아서 상태코드 보내기, 혹은 쿠키가 존재하면 자동 로그인
router.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureMessage: true
    }),
    (req, res) => {
        res.redirect(`/main/${req.user.userid}`);
    });
router.get('/login', (req, res) => {
    res.status(404).send("로그인 오류");
})

// logout
router.get('/logout/:userid', (req, res) => req.logout());

// /setting/:userid
// emailForWithdrawal 후에 userid 삭제
router.delete('/setting/:userid', emailForWithdrawal, deleteDB("userData", "users", { username: req.params.userid }))

module.exports = router;