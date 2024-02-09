// controller
const { createDB } = require('./db');

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
        res.redirect(`/?error=${message}`);
    }
};

exports.logout = (req, res, next) => {

}

exports.creatUser = async (req, res, next) => {
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

    try {
        const newUser = {
            userid: req.query.username,
            password: req.query.password,
            major: req.query.major,
            email: req.query.email,
            semester: req.query.semester,
            score: 0,
            m_score: 0,
            m_list: [],
            s_score: 0,
            s_list: [],
            eng: false,
            check: false,
            certificate: false,
        };
        await createDB(newUser);
    } catch (err) {
        throw new Error(err);
    } finally {
        await client.close();
    }
}