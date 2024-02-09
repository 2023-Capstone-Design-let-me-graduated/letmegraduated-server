const express = require('express');
const router = express.Router();
const { examPull, userPullCheck, userDelete } = require('../controller/user');

// 유저의 영어시험의 종류를 가져옴
router.get('/exam/:userid', examPull);

// userid꺼내서 졸업이 가능한지 자격기준을 확인
router.put('/exam/:userid',userPullCheck);

// userid를 삭제
router.delete('/setting/:userid', userDelete);
module.exports = router;