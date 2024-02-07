const express = require('express');
const router = express.Router();
const { rendCreatUser } = require('../controller/user');

router.post('/signup', rendCreatUser);

// userid에서 졸업시험요건 꺼내기
router.get('/exam/:userid', function(req, res, next) {
});

// userid꺼내서 자격기준 점수 조건 맞는지 확인하고 true false
router.put('/exam/:userid',(req,res,next)=>{// 함수이름(req.params.userid)
});

module.exports = router;