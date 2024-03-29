// index
const { createDB, readDB, updateDB, deleteDB } = require("./db");
const { checkScore } = require("./check");

/**
 *  capstone1, 2들었는지 확인 하는 함수
 *  @param {object} reqbodyneed
 *
 */
const capstone = async (reqbodyneed, checkCapstone) => {
  for (let item of reqbodyneed) {
    if (item.hasOwnProperty("sub_name") && item.sub_name == checkCapstone) {
      return true;
    }
  }
  return false;
};
/**
 * list를 받아서 need,choice,fundamental로 나누는 함수
 * @param {array} list
 */
const divideList = async (list) => {
  // need, choice, fundamental로 분류할 객체 생성
  try {
    result = { need: [], choice: [], foundamental: [] };

    // list.forEach((v) => {
    //   if (v.c_area.includes("전공")) {
    //     if (v.c_area.endsWith("핵심") || v.c_area.endsWith("필수")) {
    //       v.need.push(v);
    //     } else if (v.c_area.endsWith("심화") || v.c_area.endsWith("선택")) {
    //       v.choice.push(v);
    //     } else if (v.c_area.endsWith("기초")) {
    //       v.foundamental.push(v);
    //     }
    //   } else if (v.c_area.includes("교양") || v.c_major.includes("교양")) {
    //     if (v.c_major == "기초교양" || v.c_area == "기초교양") {
    //       v.foundamental.push(v);
    //     } else {
    //       v.need.push(v);
    //     }
    //   }
    // });
    if (list[0].c_area.includes("전공")) {
      list.forEach((v) => {
        if (v.c_area.endsWith("핵심") || v.c_area.endsWith("필수")) {
          result.need.push(v);
        } else if (v.c_area.endsWith("심화") || v.c_area.endsWith("선택")) {
          result.choice.push(v);
        } else if (v.c_area.endsWith("기초")) {
          result.foundamental.push(v);
        }
      });
    } else if (
      list[0].c_area.includes("교양") ||
      list[0].c_major.includes("교양")
    ) {
      list.forEach((v) => {
        if (v.c_major == "기초교양" || v.c_area == "기초교양") {
          list.foundamental.push(v);
        } else {
          list.need.push(v);
        }
      });
    }

    return result;
  } catch (err) {
    throw new Error(err);
  }
};

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
      req.user.m_score + req.user.s_score + req.user.n_score >= 140 &&
      req.user.s_check &&
      req.user.m_check &&
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
    major = { need: [], choice: [], foundamental: [] };
    const data = await readDB("timeTable", selectedSemester, {
      c_area: /전공/i,
    });
    data.forEach((v) => {
      if (v.c_area.endsWith("핵심") || v.c_area.endsWith("필수")) {
        if (!major.need.includes(v.sub_name)) {
          major.need.push(v);
        }
      } else if (v.c_area.endsWith("심화") || v.c_area.endsWith("선택")) {
        if (!major.choice.includes(v.sub_name)) {
          major.choice.push(v);
        }
      } else if (v.c_area.endsWith("기초")) {
        if (!major.foundamental.includes(v.sub_name)) {
          major.foundamental.push(v);
        }
      }
    });
    return res.json(major);
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
      if (v.c_major == "기초교양" || v.c_area == "기초교양") {
        if (!minor.foundamental.includes(v.sub_name)) {
          minor.foundamental.push(v);
        }
      } else {
        if (!minor.need.includes(v.sub_name)) {
          minor.need.push(v);
        }
      }
    });
    return res.json(minor);
  } catch (err) {
    throw new Error(err);
  }
};

exports.takeSemester = (req, res, next) => {
  res.json({ semester: req.user.semester });
};

exports.updateUserMinor = async (req, res, next) => {
  // let updateMinorList1 = req.body.sFoundamentalList; // [{ sub_name: "대학영어회화1", credit: 3 }, { sub_name: "대학영어회화2", credit: 2 }]; // {"기초교양" : 이렇게 받고}
  // let updateMinorList2 = req.body.sNeedList; // [{c_area :"INU핵심글로벌", credit : 3}]; // {"교양필수" : 이렇게 받고}
  // // 데이터 받는 코드
  const { result } = await divideList(req.body.list);
  const reqbodysScore = req.body.sScore;
  const reqbodyneed = result.need;
  const reqbodyfoundamental = result.foundamental;

  let sFoundamentalList = []; // 기초 교양리스트
  let sNeedList = []; // 교양필수 리스트
  let s_score = req.user.sScore; // 교양 점수
  let n_score = 0; // 교양피수 점수
  let conditionName = { userid: req.user.userid }; // condition
  try {
    const data = await readDB("criteria", "score", { name: "졸업요건" }, false);

    let allFoundamentalList = data.s_list["기초교양"]; // (수정용)졸업요건 기초교양
    let allNeedList = data.s_list["교양필수"]; // (수정용)졸업요건 교양필수

    let allFoundamentalListN = [...allFoundamentalList]; // (확인용)졸업요건 기초교양
    let allNeedListN = [...allNeedList]; // (확인용)졸업요건 교양필수

    // 교양기초 중복안되게 리스트에 넣기
    for (let list of reqbodyfoundamental) {
      if (!sFoundamentalList.includes(list.sub_name)) {
        sFoundamentalList.push(list.sub_name);
        allFoundamentalList.splice(
          allFoundamentalList.indexOf(list.sub_name),
          1
        );
        s_score += list.credit;
      }
    }
    s_score+=reqbodysScore;
    await updateDB("userData", "users", conditionName, {
      "s_list.sFoundamentalList": sFoundamentalList,
    });

    await updateDB("userData", "users", conditionName, {
      s_score: s_score,
    });

    // 교양 필수 관련
    // 데이터 받아서 > c_area에 중복 안되게 넣고 n_score에 학점 추가
    for (let list of reqbodyneed) {
      if (!sNeedList.includes(list.c_area)) {
        sNeedList.push(list.c_area);
        allNeedList.splice(allNeedList.indexOf(list.c_area), 1);
        n_score += list.credit;
      }
    }
    await updateDB("userData", "users", conditionName, {
      "s_list.sNeedList": sNeedList,
    });

    await updateDB("userData", "users", conditionName, {
      n_score: n_score,
    });

    const check = await checkScore("s_core", s_score);
    check = s_score<=55 ? check : false;
    // 졸업 요건
    if (check && sFoundamentalList.length === 6 && sNeedList.length === 3) {
      await updateDB("userData", "users", conditionName, { s_check: true });

      const report = {};
      report["state"] = true;
      report["checkState"] = true; // 학점을 다 들었는가?
      report["sFoundamentalList"] = true; // 기초교양 다 들었는지
      report["sNeedList"] = true; // 교양 필수 다들었는지
      report["s_score"] = s_score; // 현재 교양학점 학점
      report["s_fundamental_list"] = allFoundamentalList; // 부족한 기초교양리스트
      report["s_need_list"] = allNeedList; // 부족한 교양필수리스트
      res.json(report);
    } else {
      await updateDB("userData", "users", conditionName, { s_check: false });

      const report = {};
      report["state"] = false;
      report["checkState"] = false; // 학점을 다 들었는가?
      report["sFoundamentalList"] = false; // 기초교양 다 들었는지
      report["sNeedList"] = false; // 교양 필수 다들었는지
      report["s_score"] = s_score; // 현재 교양학점 학점
      report["s_fundamental_list"] = allFoundamentalList; // 부족한 기초교양리스트
      report["s_need_list"] = allNeedList; // 부족한 교양필수리스트
      // 유저기초교양과 졸업요건의 기초교양을 비교
      if (allFoundamentalListN === sFoundamentalList) {
        report["sFoundamentalList"] = true; // 기초교양 다 들었는지
      }
      // 유저교양필수와 졸업요건의 교양필수를 비교
      if (allNeedListN === sNeedList) {
        report["sNeedList"] = true;
      }
      if (check) {
        report["checkState"] = true;
      }
      res.json(report);
    }
  } catch (err) {
    throw new Error(err);
  }
};

exports.updateUserMajor = async (req, res, next) => {
  const result = await divideList(req.body.list);
  const reqbodyneed = result.need;
  const reqbodychoice = result.choice;
  const reqbodyfoundamental = result.foundamental;
  const needList = [];
  const choiceList = [];
  const foundamentalList = [];
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
    await updateDB("userData", "users", conditionName, {
      m_score: m_score,
    });
    reqbodychoice.forEach((value) => {
      if (!choiceList.includes(value.sub_name)) {
        choiceList.push(value.sub_name);
        m_score += value.credit;
      }
    });
    reqbodyfoundamental.forEach((value) => {
      if (!foundamentalList.includes(value.sub_name)) {
        foundamentalList.push(value.sub_name);
        data.m_b_list.splice(data.m_b_list.indexOf(value.sub_name), 1);
        m_score += value.credit;
      }
    });
    await updateDB("userData", "users", conditionName, {
      m_b_list: foundamentalList,
    });
    const m_need_check = await checkScore("m_need_score", m_need_score);
    const m_b_check = foundamentalList.length;
    const check = await checkScore("m_score", m_score);
    let capstone1 = await capstone(reqbodyneed, "캡스톤디자인(1)");
    let capstone2 = await capstone(reqbodyneed, "캡스톤디자인(2)");

    if (capstone1 && capstone2 && m_b_check == 5 && m_need_check && check) {
      const report = {};
      report["state"] = true;
      report["checkState"] = true; // 학점을 다 들었는가?
      report["m_need_checkState"] = true; // 필수 과목을 조건에 맞게 다 들었는가?
      report["capstoneState"] = true; // 캡스톤 디자인 1 2 를 들었는가?
      report["m_b_check"] = true;
      report["m_score"] = m_score; // 현재 전공 학점
      report["m_need_score"] = m_need_score; // 현재 필수 과목 학점
      report["m_need_list"] = data.m_list; // 남은 필수 과목
      report["m_b_list"] = data.m_b_list; // 남은 전공기초과목
      await updateDB("userData", "users", conditionName, { m_check: true });
      res.json(report);
    } else {
      await updateDB("userData", "users", conditionName, { m_check: false });
      const report = {};
      report["state"] = false;
      report["checkState"] = true; // 학점을 다 들었는가?
      report["m_need_checkState"] = true; // 필수 과목을 조건에 맞게 다 들었는가?
      report["capstoneState"] = true; // 캡스톤 디자인 1 2 를 들었는가?
      report["m_b_check"] = true;
      report["m_score"] = m_score; // 현재 전공 학점
      report["m_need_score"] = m_need_score; // 현재 필수 과목 학점
      report["m_need_list"] = data.m_list; // 남은 필수 과목
      report["m_b_list"] = data.m_b_list; // 남은 전공 기초 과목
      if (!(capstone1 && capstone2)) {
        report["capstoneState"] = false;
      }
      if (!m_need_check) {
        report["m_need_checkState"] = false;
      }
      if (m_b_check != 4) {
        report["m_b_check"] = false;
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

exports.updateUserNormal = async (req, res, next) => {
  return await updateDB(
    "userData",
    "users",
    { userid: req.user.userid },
    { n_score: req.body.score }
  );
};