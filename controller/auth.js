// auth
exports.isLoggedIn = (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      next();
    } else {
      throw new Error("(로그인이 필요한 서비스)");
    }
  } catch (err) {
    next(err);
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      next();
    } else {
      throw new Error("(이미 로그인한 상태)");
    }
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  /**
   * 사용자가 필요한 데이터들
   * userid : 유저이름 [string]
   * password : 패스워드 []
   * major : 전공 (컴퓨터공학, 컴퓨터공학(야)) [string]
   * semester : 학기 [array]
   * score : 현재 취득학점 [int]
   * m_score : 전공학점 [int]
   * m_list : 전공필수 리스트 [array]
   * m_need_score : 전공필수학점 [int]
   * m_check : 전공 졸업 요건 충족
   * s_score : 교양학점 [int]
   * s_list : 교양 리스트 {기초교양:[],교양필수:[]}
   * s_check : 교양 졸업 요건 충족
   * eng : 영어 졸업 인증 [bool]
   * engcheck : 신청여부 [bool]
   * certificate : 졸업 자격 기준 [bool]
   */
  const bcrypt = require("bcrypt");
  const { createDB, readDB } = require("./db");
  try {
    const { userid, major, email, semester } = req.body;
    const newUser = {
      userid: userid,
      major: major,
      email: email,
      semester: semester,
      score: 0,
      m_score: 0,
      m_list: [],
      m_need_score: 0,
      m_check: false,
      s_score: 0,
      s_list: { sNeedList: [], sFoundamentalList: [] },
      s_check: false,
      eng: false,
      engcheck: false,
      certificate: false,
    };
    const invalidcheck = await readDB(
      "userData",
      "users",
      { email: email },
      false
    );
    if (!invalidcheck) {
      newUser.password = await bcrypt.hash(req.body.password, 10);
      await createDB(newUser);
      res.status(201).json({ message: "User created successfully" });
    } else {
      throw new Error("invalid email");
    }
  } catch (err) {
    next(err);
  }
};

