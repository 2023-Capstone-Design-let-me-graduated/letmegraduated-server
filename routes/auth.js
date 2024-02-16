const express = require("express");
const { emailForSignUp, emailForWithdrawal } = require("../controller/email");
const router = express.Router();
const { deleteDB } = require("../controller/db");
const { createUser, isNotLoggedIn, isLoggedIn } = require("../controller/auth");
var passport = require("passport");

// /signup
// emailForSignUp으로 res.send(해줘야함.)
router.post("/signup/email", isNotLoggedIn, emailForSignUp, (req, res) =>
  res.send(req.secret)
);

// /signup
// req.body의 데이터를 활용하여 회원 가입
router.post("/signup", isNotLoggedIn, createUser);

// /login
// req.body.id와 req.body.password를 활용하여 로그인
router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(404).send("로그인 오류");
    }
    // 여기 값 바꾸면 api 검사 가능
    return req.login(user, () => {
      res.status(200).send("로그인 성공");
    });
  })(req, res, next);
});

// logout
router.get("/logout", isLoggedIn, (req, res, next) =>
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  })
);

// //테스트 용
// router.get("/login", (req, res, next) => {
//   return res.sendFile(__dirname + "/login.html");
// });

// /user
// emailForWithdrawal 후에 userid 삭제
router.delete("/user", isLoggedIn, emailForWithdrawal, (req, res) => {
  deleteDB("userData", "users", { userid: req.user.userid });
  res.status(200).send("탈퇴 성공");
});

module.exports = router;