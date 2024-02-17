// index
const { createDB, readDB, updateDB, deleteDB } = require("./db");
const { check } = require("./check");

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
      if (v.c_major=="기초교양"| v.c_area=="기초교양"){
        minor.foundamental.push(v.sub_name);
      }else{
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
}

exports.updateUserMinor = async(req, res, next) => {
  let updateMinorList1 = req.body.needList; // {"기초교양" : 이렇게 받고}
  let updateMinorList2 = req.body.sNeedList; // {"교양필수" : 이렇게 받고}
  let conditionName = { userid : req.user.userid };
  try {
    const data = await readDB("criteria", "score", { name : "졸업요건" }, false);
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
    await updateDB("userData", "users", conditionName, { s_check : check });
  } catch(err) {
      throw new Error(err);
  }
};

exports.updateUserMajor = async (req, res, next) => {
  let updateMajorList = req.body.list; // 배열로 받음
  let conditionName = { userid: req.user.userid };
  try {
    const user = await readDB("userData", "users", conditionName, false);
    const data = await readDB("criteria", "score", { name: "졸업요건" }, false);
    // 졸업요건 배열이랑 클라이언트에서 받은 전공필수 배열이랑 비교해서 없으면 유저리스트에 추가
    updateMajorList.forEach((value) => {
      if (!data.m_list.includes(value)) {
        updateDB("userData", "users", conditionName, { c_check : value });
      }
    });

    const check = checkScore("m_need_score", user.m_need_score);
    await updateDB("userData", "users", conditionName, { m_check: check });
  } catch (err) {
    throw new Error(err);
  }
};
