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
 * @param {array} subjectList
 * @param {object} dataObject
 * @returns boolean
 *
 * subjectList의 각 요소에서 dataObject가 있는지 확인
 */
const checkDuplication = async (subjectList, dataObject) => {
  return subjectList.some((v) => v.sub_name === dataObject.sub_name);
};

/**
 * list를 받아서 need,choice,fundamental로 나누는 함수
 * @param {array} list
 */
const divideList = async (list) => {
  // need, choice, fundamental로 분류할 객체 생성
  try {
    result = { need: [], choice: [], foundamental: [] };
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
          result.foundamental.push(v);
        } else {
          result.need.push(v);
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
      report["score"] = req.user.m_score + req.user.s_score + req.user.n_score;
      report["m_need_score"] = req.user.m_need_score;
      report["m_score"] = req.user.m_score;
      report["s_score"] = req.user.s_score;
      report["n_score"] = req.user.n_score;
      report["engcheck"] = req.user.engcheck;
      report["eng_comparison"] = req.user.eng;
      res.json(report);
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
    report["eng_comparison"] = req.user.eng;
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
    res.sendStatus(200);
  }
};

// /major/semester | POST | 선택된수강학기{string} | 선택된 수강학기의 모든 전공 과목 리스트를 꺼내온다. | object(array)
exports.readMajor = async (req, res, next) => {
  const selectedSemester = req.body.selectedSemester;
  try {
    let major = { need: [], choice: [], foundamental: [] };
    const data = await readDB("timeTable", selectedSemester, {
      c_area: /전공/i,
    });
    for (const v of data) {
      if (v.c_area.endsWith("핵심") || v.c_area.endsWith("필수")) {
        if (!(await checkDuplication(major.need, v))) {
          major.need.push(v);
        }
      } else if (v.c_area.endsWith("심화") || v.c_area.endsWith("선택")) {
        if (!(await checkDuplication(major.choice, v))) {
          major.choice.push(v);
        }
      } else if (v.c_area.endsWith("기초")) {
        if (!(await checkDuplication(major.foundamental, v))) {
          major.foundamental.push(v);
        }
      }
    }
    const grade = (a, b) => {
      const grades = [1, 2, 3, 4, "전학년"];
      const gradeAIndex = grades.indexOf(a.grade);
      const gradeBIndex = grades.indexOf(b.grade);

      if (gradeAIndex !== -1 && gradeBIndex !== -1) {
        return gradeAIndex - gradeBIndex;
      }

      if (gradeAIndex !== -1) {
        return -1;
      }

      if (gradeBIndex !== -1) {
        return 1;
      }

      return 0;
    };
    major.need.sort(grade);
    major.choice.sort(grade);
    major.foundamental.sort(grade);

    return res.json(major);
  } catch (err) {
    throw new Error(err);
  }
};

// /minor/semester | POST | 선택된수강학기{string} | 선택된 수강학기의 모든 교양 과목 리스트를 꺼내온다.
exports.readMinor = async (req, res, next) => {
  const selectedSemester = req.body.selectedSemester;
  try {
    let minor = { need: [], foundamental: [] };
    const data = await readDB("timeTable", selectedSemester, {
      $or: [{ c_area: /교양/ }, { c_major: /교양/ }],
    });
    for (const v of data) {
      if (v.c_area.endsWith("기초교양") || v.c_area.endsWith("학문의기초")) {
        if (!(await checkDuplication(minor.foundamental, v))) {
          minor.foundamental.push(v);
        }
      } else if (
        v.c_major.endsWith("교양필수") ||
        v.c_major.endsWith("핵심교양")
      ) {
        if (!(await checkDuplication(minor.need, v))) {
          minor.need.push(v);
        }
      }
    }
    const grade = (a, b) => {
      const grades = [1, 2, 3, 4, "전학년"];
      const gradeAIndex = grades.indexOf(a.grade);
      const gradeBIndex = grades.indexOf(b.grade);

      if (gradeAIndex !== -1 && gradeBIndex !== -1) {
        return gradeAIndex - gradeBIndex;
      }

      if (gradeAIndex !== -1) {
        return -1;
      }

      if (gradeBIndex !== -1) {
        return 1;
      }

      return 0;
    };
    minor.need.sort(grade);
    minor.foundamental.sort(grade);
    return res.json(minor);
  } catch (err) {
    throw new Error(err);
  }
};

exports.takeSemester = (req, res, next) => {
  let data =  {semester: req.user.semester }
  for (let i = 0; i < data.semester.length; i++) {
    for (let j = 0; j < data.semester.length; j++) {
      if (data.semester[i] === "2020_1") data.semester[i] = "2020년 1학기";
      else if (data.semester[i] === "2020_2") data.semester[i] = "2020년 2학기";
      else if (data.semester[i] === "2021_1") data.semester[i] = "2021년 1학기";
      else if (data.semester[i] === "2021_2") data.semester[i] = "2021년 2학기";
      else if (data.semester[i] === "2022_1") data.semester[i] = "2022년 1학기";
      else if (data.semester[i] === "2022_2") data.semester[i] = "2022년 2학기";
      else if (data.semester[i] === "2023_1") data.semester[i] = "2023년 1학기";
      else if (data.semester[i] === "2023_2") data.semester[i] = "2023년 2학기";
      else if (data.semester[i] === "2019_1") data.semester[i] = "2019년 1학기";
      else if (data.semester[i] === "2019_2") data.semester[i] = "2019년 2학기";
    }
  }
  res.json(data);
  // res.json({ semester: req.user.semester });
};

exports.updateUserMinor = async (req, res, next) => {
  // // 데이터 받는 코드
  const result = await divideList(req.body.list);
  const reqbodysScore = req.body.sScore;
  const reqbodyneed = result.need;
  const reqbodyfoundamental = result.foundamental;
  console.log(
    "확인된 sScore : ",
    reqbodysScore,
    "확인된 sScore type : ",
    typeof reqbodysScore
  );

  let sFoundamentalList = []; // 기초 교양리스트
  let sNeedList = []; // 교양필수 리스트
  let s_score = 0; // 교양 점수
  let minor_need_score = 0; // 교양필수 점수
  let conditionName = { userid: req.user.userid }; // condition
  try {
    const data = await readDB("criteria", "score", { name: "졸업요건" }, false);

    let allFoundamentalList = data.s_list["기초교양"]; // 졸업요건 기초교양 초기화
    let allNeedList = data.s_list["교양필수"]; // 졸업요건 교양필수 초기화

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
    s_score += reqbodysScore;
    await updateDB("userData", "users", conditionName, {
      "s_list.sFoundamentalList": sFoundamentalList,
    });

    // 교양 필수 관련
    // 데이터 받아서 > c_area에 중복 안되게 넣고 minor_need_score에 학점 추가
    for (let list of reqbodyneed) {
      if (!sNeedList.includes(list.c_area)) {
        sNeedList.push(list.c_area);
        allNeedList.splice(allNeedList.indexOf(list.c_area), 1);
      }
      minor_need_score += list.credit;
    }
    s_score += minor_need_score; // 교양 총학점 += 교양 필수 학점

    await updateDB("userData", "users", conditionName, {
      "s_list.sNeedList": sNeedList,
    });

    if (s_score >= 55) {
      s_score = 55;
    }
    await updateDB("userData", "users", conditionName, {
      s_score: s_score,
    });

    let check = await checkScore("s_score", s_score);

    // check = s_score <= 55 ? check : false;
    // 졸업 요건
    if (check && sFoundamentalList.length >= 6 && sNeedList.length >= 3) {
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
      if (sFoundamentalList.length >= 6) {
        report["sFoundamentalList"] = true; // 기초교양 다 들었는지
      }
      // 유저교양필수와 졸업요건의 교양필수를 비교
      if (sNeedList.length >= 3) {
        report["sNeedList"] = true;
      }
      if (check && sFoundamentalList.length >= 6 && sNeedList.length >= 3) {
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
      m_score: m_score,
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
      report["checkState"] = false; // 학점을 다 들었는가?
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
      if (check && m_need_check) {
        report["checkState"] = true;
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
