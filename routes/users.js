var express = require('express');
var router = express.Router();
const {emailForWithdrawal} = require('../controller/email');
// const {withdrawal}=require('../controller/db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/logout',function(req,res,next){
  res.send('로그 아웃');
})

// router.get('/withdrawal',emailForWithdrawal,withdrawal);

module.exports = router;
