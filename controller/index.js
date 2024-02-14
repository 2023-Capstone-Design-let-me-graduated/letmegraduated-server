// controller
const { createDB, readDB, updateDB, deleteDB } = require('./db');

// /main/:userid GET
exports.userPull = async(req, res, next) => {
    /**
     * dbName은 userData
     * collectionName은 users
     * conditionName은 { userid : "이름" } 형식으로 받음
     * 한명의 유저 데이터 내용을 가져옴
     */
    
    let conditionName = { userid : req.body.userid };

    try {
        let user = await readDB("userData", "users", conditionName, false);
        if (!user) {
            return res.status(404).json({ message : '유저를 찾을 수 없음' });
        } else {
            return res.status(200).json(user);
        }

    } catch (err) {
        throw new Error(err);
    }
}

// /main:userid PUT
exports.userExam = async(req, res, next) => {   
     /**
     * dbName은 userData
     * collectionName은 users
     * conditionName은 { username : "이름" } 형식으로 받음
     * 유저의 영어인증요견(eng)를 true로 업데이트
     */
    
    let conditionName = { userid : req.body.userid };
    let swap_t_f = req.body.swap_t_f; // 입력 받은 값이 true인지 false인지 판별
    
    try {
        let user = await readDB("userData", "users", conditionName, false);
        let engChange = { eng : swap_t_f };
        if (!user) {
            return res.status(404).json({ message : '유저를 찾을 수 없음' });
        } else {
            if (swap_t_f) {
                await updateDB("userData", "users", conditionName, engChange);
            }
        }
    } catch(err) {
        throw new Error(err);
    }
}

// /main/:userid/semester GET
exports.allSemester =  async(req, res, next) => {
    /**
     * dbName은 timeTabel
     * collectionName은 2019_1 ~ 2023_2
     * timetable에 있는 전체 시간표를 클라이언트에 보냄
     */
    
    let collectionName = req.body.collectionName;

    try {
        let allsemester = await readDB("timeTable", collectionName);
        return res.status(200).json(allsemester);
    } catch(err) {
        throw new Error(err);
    }
}

// /main/:userid/score PUT
exports.userScore = async(req, res, next) => {
    /**
     * coditionName은 유저아이디
     * 전체 학점, 전공 학점, 교양 학점을 업데이트 함
     */
    let conditionName = { userid : req.body.userid };
    let m_score = req.body.m_score;
    let s_score = req.body.s_score;
    let score = m_score + s_score;

    try {
        let user = await readDB("userData", "users", conditionName, false);
        if (!user) {
            return res.status(404).json({ message : '유저를 찾을 수 없음' });
        } else {
            await updateDB("userData", "users", conditionName, {m_score : user.m_score + m_score});
            await updateDB("userData", "users", conditionName, {s_score : user.s_score + s_score});
            await updateDB("userData", "users", conditionName, {score : user.score + score});
        }
    } catch(err) {
        throw new Error(err);
    }
}

// /main/:userid/list PUT
exports.userList = async(req, res, next) => {
    /**
     * 유저의 전공 필수 리스트, 교양 필수 리스트 업데이트
     */
    let conditionName = { userid : req.body.userid };
    let sectionSort = req.body.listName; // 리스트 이름에 따라 전공, 교양 구분
    let list = []; // 리스트로 받음
    
    try {
        let user = await readDB("userData", "users", conditionName, false);
        if (!user) {
            return res.status(404).json({ message : '유저를 찾을 수 없음' });
        } else {
            if (sectionSort === "m_list") {
                await updateDB("userData", "users", conditionName, {m_list : list});
            }
            else if (sectionSort === "s_list") {
                await updateDB("userData", "users", conditionName, {s_list : list});
            }
            else {
                throw new Error(err);
            }
        }
    } catch(err) {
        throw new Error(err);
    }
}
