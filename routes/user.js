const express = require('express');
const router = express.Router();
const { examPull, userPullCheck } = require('../controller/user');
const { isNotLoggedIn, isLoggedIn } = require("../controller/auth");

// 유저의 영어시험의 종류를 가져옴
router.get('/exam/:userid', isNotLoggedIn, examPull);

// userid꺼내서 졸업이 가능한지 자격기준을 확인
router.put('/exam/:userid',isNotLoggedIn, userPullCheck);

module.exports = router;