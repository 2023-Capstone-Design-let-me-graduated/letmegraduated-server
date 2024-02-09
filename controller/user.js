// controller
const { createDB, readDB, updateDB, deleteDB } = require('./db');

// /signup POST
exports.rendCreatUser = async (req, res, next) => {
    /**
     * 사용자가 필요한 데이터들
     * username : 유저이름 [string]
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
            userid : req.body.userid,
            password : req.body.password,
            major : req.body.major,
            semester : [],
            score : 0,
            m_score : 0,
            m_list : [],
            s_score : 0,
            s_list : [],
            eng : false,
            check : false,
            certificate : false,
          };
        await createDB(newUser);
    } catch (err) {
        throw new Error(err);
    } finally {
        await client.close();
    }
}

// /exam/userid GET
exports.examPull = async(req, res, next) => {
    /**
     * dbName은 criteria
     * collectionName은 exam
     * conditionName conditionName은 컴퓨터공학, 컴퓨터공학(야)형식으로 받음
     */

    let dbName = req.body.dbName;
    let collectionName = req.body.collectionName;
    let conditionName = req.body.major;
    try {
        if (conditionName === "컴퓨터공학") {
            const exam = await readDB(dbName, collectionName, { type : "주간" });
            return res.status(200).json(exam);
        } else {
            const exam = await readDB(dbName, collectionName, { type : "야간" });
            return res.status(200).json(exam);
        }
    } catch(err) {
        throw new Error(err);
    }
}

// /exam/userid PUT
exports.userPullCheck = async(req, res, next) => {
    /**
     * dbName은 userData
     * collectionName은 users
     * conditionName은 { username : "이름" } 형식으로 받음
     * 졸업이 가능한지 확인하는 여부를 판단
     * 전체 score는 140학점
     * 교양 s_score는 30학점 이상
     * 전공 m_score는 72학점 이상
     * 영어 졸업 인증 true
     * s_list[] 교양필수 3개이상
     * m_list[] 전공필수 7개이상
     */
    let dbName = req.body.dbName;
    let collectionName = req.body.collectionName;
    let conditionName = req.body;

    try {
        let user = await readDB(dbName, collectionName, conditionName, false);
        const s_list = user.s_list.length; // 교양필수 배열 개수를 가져옴
        const m_list = user.m_list.length; // 전공필수 배열 개수를 가져옴
        if (!user) {
            return res.status(404).json({ message : '유저를 찾을 수 없음' });
        } else {
            if (user.score >= 140 && (user.m_score >= 72 && user.s_score >= 30) && user.eng && user.check) {
               if (s_list >= 3 && m_list >= 7) {
                    await updateDB(dbName, collectionName, conditionName, { certificate : true });
               }
            }
        }
    } catch(err) {
        throw new Error(err);
    }
}

// /setting/userid DELETE
exports.userDelete = async(req, res, next) => {
    /**
     * dbName은 userData
     * collectionName은 users
     * user를 삭제하는 함수
     * conditionName은 { username : "이름" } 형식으로 받음
     */
    let dbName = req.body.dbName;
    let collectionName = req.body.collectionName;
    let conditionName = req.body;

    try {
        let user = await readDB(dbName, collectionName, conditionName, false);
        if (!user) {
            return res.status(404).json({ message : '유저를 찾을 수 없음' });
        } else {
            await deleteDB(dbName, collectionName, conditionName);
            return res.status(200).json({ message : "삭제 완료" });
        }
    } catch(err) {
        throw new Error(err);
    }
}