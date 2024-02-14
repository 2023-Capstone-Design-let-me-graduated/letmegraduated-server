const express = require("express");
const { emailForSignUp, emailForWithdrawal } = require("../controller/email");
const router = express.Router();
const { deleteDB } = require("../controller/db");
const { createUser, isNotLoggedIn, isLoggedIn } = require("../controller/auth");
var passport = require("passport");

// /signup
// emailForSignUp으로 res.send(해줘야함.)
router.get("/signup", isNotLoggedIn, emailForSignUp, (req, res) =>
  res.send(req.secret)
);

// /signup
// createUser
router.post("/signup", isNotLoggedIn, createUser);

// /login   
// query: userid랑 passward받아서 상태코드 보내기, 혹은 쿠키가 존재하면 자동 로그인
router.post(
  "/login",
  isNotLoggedIn,
  passport.authenticate('local', function (err, user) {
    if (err) { return next(err) }
    if (!user) { return res.status(404).send('로그인 오류') };
  }, (req, res) => { res.redirect(`/main/${req.user.userid}`) }));

// logout
router.post("/logout", isLoggedIn, (req, res, next) =>
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  })
);

// /setting/:userid
// emailForWithdrawal 후에 userid 삭제
router.delete(
  "/setting/:userid",
  isLoggedIn,
  emailForWithdrawal,
  (req, res) => {
    deleteDB("userData", "users", { username: req.params.userid });
  }
);

module.exports = router;