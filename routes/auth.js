const express = require('express');
const { emailForSignUp, emailForWithdrawal } = require("../controller/email");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.send("로그인");
});

module.exports = router;