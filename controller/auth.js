// controllers
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        throw new Error('이미 로그인한 상태입니다.')
    }
};

exports.createUser = async (req, res, next) => {
    /**
     * 사용자가 필요한 데이터들
     * userid : 유저이름 [string]
     * password : 패스워드 []
     * major : 전공 (컴퓨터공학, 컴퓨터공학(야)) [string]
     * semester : 학기 [array]
     * score : 현재 취득학점 [int]
     * m_score : 전공학점 [int]
     * m_list : 전공필수 리스트 [array]
     * s_score : 교양학점 [int]
     * s_list : 교양필수 리스트 [array]
     * eng : 영어 졸업 인증 [bool]
     * check : 신청여부 [bool]
     * certificate : 졸업 자격 기준 [bool]
     */
    const bcrypt = require('bcrypt');
    const { createDB, readDB } = require('./db');
    try {
        const { userid, major, email, semester } = req.body;
        const newUser = {
            userid: userid,
            major: major,
            email: email,
            semester: semester,
            score: 0,
            m_score: 0,
            m_list: [],
            s_score: 0,
            s_list: [],
            eng: false,
            check: false,
            certificate: false,
        };
        const invalidcheck = await readDB('userData', 'users', { email: email }, false);
        if (!invalidcheck) {
            newUser.password = await bcrypt.hash(req.body.password, 10);
            await createDB(newUser);
            res.status(201).json({message: 'User created successfully'});
        }else{
            throw new Error("invalid email")
        }
    } catch (err) {
        throw new Error(err);
    }
}