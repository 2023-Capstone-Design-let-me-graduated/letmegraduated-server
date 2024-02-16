// index
const { createDB, readDB, updateDB, deleteDB } = require("./db");

// /main PUT
// 유저의 영어인증요건(eng)를 true로 업데이트
exports.updataUserExam = async (req, res, next) => {
  if (req.user.eng) {
    await updateDB(
      "userData",
      "users",
      { userid: req.user.userid },
      { engcheck: req.body.engcheck }
    );
  }
};

// /main/score PUT
// 전체 학점, 전공 학점, 교양 학점을 업데이트 함
exports.updataUserScore = async (req, res, next) => {
  /**
   * coditionName은 유저아이디
   */
  let conditionName = { userid: req.body.userid };
  let m_score = req.body.m_score;
  let s_score = req.body.s_score;
  let score = m_score + s_score;

  try {
    let user = await readDB("userData", "users", conditionName, false);
    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없음" });
    } else {
      await updateDB("userData", "users", conditionName, {
        m_score: user.m_score + m_score,
      });
      await updateDB("userData", "users", conditionName, {
        s_score: user.s_score + s_score,
      });
      await updateDB("userData", "users", conditionName, {
        score: user.score + score,
      });
    }
    next();
  } catch (err) {
    throw new Error(err);
  }
};

// /main/:userid/list PUT
// 유저의 전공 필수 리스트, 교양 필수 리스트 업데이트
exports.updataUserList = async (req, res, next) => {
  let conditionName = { userid: req.body.userid };
  let sectionSort = req.body.listName; // 리스트 이름에 따라 전공, 교양 구분
  let list = req.body.list; // 배열로 받음

  try {
    let user = await readDB("userData", "users", conditionName, false);
    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없음" });
    } else {
      if (sectionSort === "m_list") {
        list.forEach((value) => {
          if (!user.m_list.includes(value)) {
            updateDB("userData", "users", conditionName, { m_list: value });
          }
        });
      } else if (sectionSort === "s_list") {
        list.forEach((value) => {
          if (!user.s_list.includes(value)) {
            updateDB("userData", "users", conditionName, { s_list: value });
          }
        });
        next();
      } else {
        throw new Error("올바르지 않은 리스트");
      }
    }
  } catch (err) {
    next(err);
  }
};

// /main/:userid/engcheck PUT
// 유저가 영어 졸업인증 신청을 했는 확인
exports.userEngCheck = async (req, res, next) => {
  let conditionName = { userid: req.body.userid };
  let swap_t_f = req.body.swap_t_f; // 입력 받은 값이 true인지 false인지 판별

  try {
    let user = await readDB("userData", "users", conditionName, false);
    let Change = { check: swap_t_f };
    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없음" });
    } else {
      await updateDB("userData", "users", conditionName, Change);
    }
  } catch (err) {
    throw new Error(err);
  }
};

// /major/semester GET
// timetable에서 전공필수, 전공선택을 가져옴 (해당 유저의 데이터만 가져와야한다.)
exports.readMajor = async (req, res, next) => {
  /**
   * dbName = timeTable
   * collectionName = "2019_1 ~ 2023_2" (범위)
   * conditionName = { c_area : /전공/i }
   */
  let collections = req.user.semester;
  try {
    major = { need: {}, choice: {} };
    collections.forEach(async (value) => {
      major.need[value] = [];
      major.choice[value] = [];
      const data = await readDB("timeTable", value, { c_area: /전공/i });
      data.forEach((v) => {
        if (v.c_area.endsWith("핵심") || v.c_area.endsWith("필수")) {
          major.need[value].push(v);
        } else if (v.c_area.endsWith("심화") || v.c_area.endsWith("선택")) {
          major.choice[value].push(v);
        }
      });
    });
    return res.status(200).json(major);
  } catch (err) {
    throw new Error(err);
  }
};

// /minor/semester GET
// timetable에서 교양필수 가져옴 (해당 유저의 데이터만 가져와야 한다.)
exports.readMinor = async (req, res, next) => {
  /**
   * dbName = timeTable
   * collectionName = "2019_1 ~ 2023_2" (해당 범위)
   * conditionName = {c_area : { "$regex": /INU|기초교양/i}}
   * return minor = {need:{"2019_1":[과목들],"2019_2":[과목들] ... }}
   */
  let collections = req.user.semester;
  try {
    minor = { need: {} };
    collections.forEach(async (value) => {
      major.need[value] = [];
      const data = await readDB("timeTable", value, {
        c_area: { $regex: /INU|기초교양/i },
      });
      data.forEach((v) => {
        minor.need[value].push(v);
      });
    });
    return res.status(200).json(minor);
  } catch (err) {
    throw new Error(err);
  }
};

exports.takeSemester = (req, res, next) => {
  res.json(req.user.semester);
};