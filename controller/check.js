const { readDB } = require("./db");

/**
 * 숫자가 졸업 조건인 type과 자신의 숫자 score를 넣어서 졸업 조건에 충족했는지 확인하는 함수
 * @param {string} type
 * @param {number} score
 *  @returns {boolean}
 */
exports.checkScore = async (type, score) => {
  const data = await readDB("criteria", "score", { name: "졸업요건" }, false);
  const criteria = data[type];
  return criteria <= score;
};