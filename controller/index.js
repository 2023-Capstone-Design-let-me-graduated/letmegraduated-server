// controller
const { createDB, readDB, updateDB, deleteDB } = require('./db');

// /main/:userid GET
exports.userPull = async(req, res, next) => {
    /**
     * dbName은 userData
     * collectionName은 users
     * conditionName은 { username : "이름" } 형식으로 받음
     * 한명의 유저 데이터 내용을 가져옴
     */
    let dbName = req.body.dbName;
    let collectionName = req.body.collectionName;
    let conditionName = req.body;

    try {
        let user = await readDB(dbName, collectionName, conditionName, false);
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
    let dbName = req.body.dbName;
    let collectionName = req.body.collectionName;
    let conditionName = req.body;
    let swap_t_f = req.body.swap_t_f; // 입력 받은 값이 true인지 false인지 판별
    
    try {
        let user = await readDB(dbName, collectionName, conditionName, false);
        let engChange = { eng : swap_t_f };
        if (!user) {
            return res.status(404).json({ message : '유저를 찾을 수 없음' });
        } else {
            if (swap_t_f) {
                await updateDB(dbName, collectionName, conditionName, engChange);
            }
        }
    } catch(err) {
        throw new Error(err);
    }
}