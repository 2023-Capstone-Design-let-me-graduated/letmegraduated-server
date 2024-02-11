// controller
const { readDB, updateDB, deleteDB } = require('./db');


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