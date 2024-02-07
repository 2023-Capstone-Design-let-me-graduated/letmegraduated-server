const express = require('express');
const router = express.Router();
const {indexController} = require('../controller/index');

// 메인화면에 필요한 모든 데이터 꺼내는 함수
router.get('/main/:userid', function(req, res, next) {
});

// userid 꺼내서 영어 졸업인증요건 바꾸는 함수
router.put('/main/:userid',(req,res,next)=>{// 함수이름(req.params.userid)
});

// major

// minor

// normal

module.exports = router;