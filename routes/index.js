const express = require('express');
const router = express.Router();
const {userPull, userExam} = require('../controller/index');

// 유저 데이터를 가져옴
router.get('/main/:userid', userPull);

// 유저의 영어 졸업 인증 요건을 수정
router.put('/main/:userid', userExam);

// major

// minor

// normal

module.exports = router;