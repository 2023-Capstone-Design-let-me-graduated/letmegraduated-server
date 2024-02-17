// index
const { createDB, readDB, updateDB, deleteDB } = require("./db");
const { check } = require("./check");

// /main GET
// 취득 학점, 전공필수, 전공 학점, 교양 학점, 자격기준 조건을 꺼내옴
exports.readTotalData = async (req, res, next) => {
  try {
    await updateDB(
      "userData",
      "users",
      { userid: req.user.userid },
      { score: req.user.m_score + req.user.s_score + req.user.n_score }
    );
    const report = {};
    if (
      (req.user.m_score + req.user.s_score + req.user.n_score >= 140) &
      req.user.s_check &
      req.user.m_check &
      req.user.engcheck
    ) {
      report["state"] = true;
      await updateDB(
        "userData",
        "users",
        { userid: req.user.userid },
        { certificate: true }
      );
    } else {
      report["state"] = false;
      await updateDB(
        "userData",
        "users",
        { userid: req.user.userid },
        { certificate: false }
      );
    }
    report["score"] = req.user.m_score + req.user.s_score + req.user.n_score;
    report["m_need_score"] = req.user.m_need_score;
    report["m_score"] = req.user.m_score;
    report["s_score"] = req.user.s_score;
    report["n_score"] = req.user.n_score;
    report["engcheck"] = req.user.engcheck;
    res.json(report);
  } catch (err) {
    next(err);
  }
};

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

// /major/semester | POST | 선택된수강학기{string} | 선택된 수강학기의 모든 전공 과목 리스트를 꺼내온다. | object(array)
exports.readMajor = async (req, res, next) => {
  const selectedSemester = req.body.selectedSemester;
  try {
    major = { need: [], choice: [] };
    const data = await readDB("timeTable", selectedSemester, {
      c_area: /전공/i,
    });
    data.forEach((v) => {
      if (v.c_area.endsWith("핵심") || v.c_area.endsWith("필수")) {
        major.need.push(v);
      } else if (v.c_area.endsWith("심화") || v.c_area.endsWith("선택")) {
        major.choice.push(v);
      }
    });
    return res.status(200).json(major);
  } catch (err) {
    throw new Error(err);
  }
};

// /minor/semester | POST | 선택된수강학기{string} | 선택된 수강학기의 모든 교양 과목 리스트를 꺼내온다.
exports.readMinor = async (req, res, next) => {
  const selectedSemester = req.body.selectedSemester;
  try {
    minor = { need: [], foundamental: [] };
    const data = await readDB("timeTable", selectedSemester, {
      $or: [{ c_area: /교양/ }, { c_major: /교양/ }],
    });
    data.forEach((v) => {
      if ((v.c_major == "기초교양") | (v.c_area == "기초교양")) {
        minor.foundamental.push(v.sub_name);
      } else {
        minor.need.push(v.sub_name);
      }
    });
    return res.status(200).json(minor);
  } catch (err) {
    throw new Error(err);
  }
};

exports.takeSemester = (req, res, next) => {
  res.json(req.user.semester);
};

exports.updateUserMinor = async (req, res, next) => {
  let updateMinorList1 = req.body.needList; // {"기초교양" : 이렇게 받고}
  let updateMinorList2 = req.body.sNeedList; // {"교양필수" : 이렇게 받고}
  let conditionName = { userid: req.user.userid };
  try {
    const data = await readDB("criteria", "score", { name: "졸업요건" }, false);
    // 졸업요건 배열이랑 클라이언트에서 받은 기초교양 배열이랑 비교해서 없으면 유저리스트에 추가
    updateMinorList1.forEach((value) => {
      if (!data.s_list.기초교양.includes(value.sub_name)) {
        updateDB("userData", "users", conditionName, {
          s_list: { 기초교양: value.sub_name },
        }); //쿼리 다시 짜야됨 리스트에 추가하는 식으로
      }
    });
    // 이건 교양필수에 관련
    updateMinorList2.forEach((value) => {
      if (!data.s_list.교양필수.includes(value.sub_name)) {
        updateDB("userData", "users", conditionName, {
          s_list: { 교양필수: value.sub_name },
        }); //쿼리 다시 짜야됨 리스트에 추가하는 식으로
      }
    });
    const check = checkScore("s_core", user.s_score);
    await updateDB("userData", "users", conditionName, { s_check: check });
  } catch (err) {
    throw new Error(err);
  }
};

exports.updateUserMajor = async (req, res, next) => {
  const reqbodyneed = req.body.need;
  const reqbodychoice = req.body.choice;
  const needList = [];
  const choiceList = [];
  let m_score = 0;
  let m_need_score = 0;
  let conditionName = { userid: req.user.userid };
  try {
    const data = await readDB("criteria", "score", { name: "졸업요건" }, false);
    reqbodyneed.forEach((value) => {
      if (!needList.includes(value.sub_name)) {
        needList.push(value.sub_name);
        data.m_list.splice(data.m_list.indexOf(value.sub_name), 1);
        m_score += value.credit;
        m_need_score += value.credit;
      }
    });
    await updateDB("userData", "users", conditionName, {
      m_need_score: m_need_score,
    });
    await updateDB("userData", "users", conditionName, {
      m_list: needList,
    });
    reqbodychoice.forEach((value) => {
      if (!choiceList.includes(value.sub_name)) {
        choiceList.push(value.sub_name);
        m_score += value.credit;
      }
    });
    const m_need_check = checkScore("m_need_score", m_need_score);
    const check = checkScore("m_score", m_score);
    if (
      reqbodyneed.includes("캡스톤디자인 (1)") &
      reqbodyneed.includes("캡스톤디자인 (2)") &
      m_need_check &
      check
    ) {
      const report = {};
      report["state"] = true;
      report["checkState"] = true; // 학점을 다 들었는가?
      report["m_need_checkState"] = true; // 필수 과목을 조건에 맞게 다 들었는가?
      report["capstoneState"] = true; // 캡스톤 디자인 1 2 를 들었는가?
      report["m_score"] = m_score; // 현재 전공 학점
      report["m_need_score"] = m_need_score; // 현재 필수 과목 학점
      report["m_need_list"] = data.m_list; // 남은 필수 과목
      await updateDB("userData", "users", conditionName, { m_check: true });
      res.json(report);
    } else {
      await updateDB("userData", "users", conditionName, { m_check: false });
      const report = {};
      report["state"] = false;
      report["checkState"] = true; // 학점을 다 들었는가?
      report["m_need_checkState"] = true; // 필수 과목을 조건에 맞게 다 들었는가?
      report["capstoneState"] = true; // 캡스톤 디자인 1 2 를 들었는가?
      report["m_score"] = m_score; // 현재 전공 학점
      report["m_need_score"] = m_need_score; // 현재 필수 과목 학점
      report["m_need_list"] = data.m_list; // 남은 필수 과목
      if (
        !(
          reqbodyneed.includes("캡스톤디자인 (1)") &
          reqbodyneed.includes("캡스톤디자인 (2)")
        )
      ) {
        report["capstoneState"] = false;
      }
      if (!m_need_check) {
        report["m_need_checkState"] = false;
      }
      if (!check) {
        report["checkState"] = false;
      }
      res.json(report);
    }
  } catch (err) {
    throw new Error(err);
  }
};

exports.updateUserNormal=async (req,res,next)=>{
  return await updateDB("userData","users",{userid: req.user.userid},{n_score: req.body.score});
}