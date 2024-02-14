const express = require('express');
const router = express.Router();
const {userPull, userExam, allSemester, userScore, userList} = require('../controller/index');

// 유저 데이터를 클라이언트에 보냄
router.get('/main/:userid', userPull);

// 유저의 영어 졸업 인증 요건을 업데이트
router.put('/main/:userid', userExam);

// timetable에 있는 전체 시간표를 클라이언트에 보냄
router.get('/main/:userid/semester', allSemester);

// 유저의 전체학점, 전공학점, 교양학점을 업데이트
router.put('/main/:userid/score', userScore);

// 유저의 전공 필수 리스트, 교양 필수 리스트 업데이트
router.put('/main/:userid/list', userList);

// major

// get /semester

// get /need

// get

// put

// minor

// get /semester

// get /need

// get

// put

// normal

// put

// get

module.exports = router;