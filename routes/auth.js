const express = require('express');
const { emailForSignUp, emailForWithdrawal } = require("../controller/email");
const router = express.Router();
const { rendCreatUser } = require('../controller/user');

// /signup/useremail
// emailForSignUp으로 res.send(해줘야함.)
router.get("/signup/:useremail", emailForSignUp, (req,res)=>res.send(req.secret));

// /signup
// createUser
router.post('/signup', rendCreatUser);

// /login
// query: userid랑 passward받아서 상태코드 보내기, 혹은 쿠키가 존재하면 자동 로그인
router.get('/login',);

// logout
router.get('/logout/:userid',(req,res,next)=>{

})

// /setting/:userid
// emailForWithdrawal 후에 userid 삭제
router.delete('/setting/:userid',(req,res,next)=>{

})

module.exports = router;