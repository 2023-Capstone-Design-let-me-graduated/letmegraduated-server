/**
 *
 * @param {string} receiverEmail
 * @returns {string} secretCode
 * 사용자의 이메일을 받으면 Oauth 인증을 통해서 robot9917@gmail.com에서 해당 이메일로 인증을 보내게 됩니다.
 * 보낸 인증에서는 uuidv4를 활용하여 랜덤으로 16자리 수가 들어가게 되고 이는 return으로 받게 되어 클라이언트에서 비교할 수 있습니다.
 */
function emailForSignUp(receiverEmail) {
  const nodemailer = require("nodemailer");
  const { v4: uuidv4 } = require("uuid");
  const secretCode = uuidv4();
  const {
    OAUTH_USER,
    OAUTH_CLIENT_ID,
    OAUTH_CLIENT_SECRET,
    OAUTH_REFRESH_TOKEN,
  } = process.env;
  async function main(receiverEmail) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.google.com",
      port: 587,
      secure: true,
      auth: {
        type: "OAuth2",
        user: `${OAUTH_USER}`,
        clientId: `${OAUTH_CLIENT_ID}`,
        clientSecret: `${OAUTH_CLIENT_SECRET}`,
        refreshToken: `${OAUTH_REFRESH_TOKEN}`,
      },
    });
    const message = {
      from: OAUTH_USER,
      to: receiverEmail,
      subject: "letmegraduated 앱 회원 인증을 위한 이메일입니다.",
      html: `
      <h1>
        아래의 코드를 앱에 입력해주세요.
      </h1>
      <hr />
      <br />
      <p>아래의 코드는 다른 사람에게 공유해서는 안되며 인증마다 다른 코드가 입력됩니다.<p/>
      <p>코드는 다음과 같습니다. ${secretCode}</p>
      <br />
      <hr />
      <p>이 메일은 letmegraduated app 회원 인증을 위해서 전송되었습니다.</p>
      <p>이 메일을 요청한 적이 없으시다면 무시해 주세요.</p>
    `,
    };
    await transporter.sendMail(message);
  }
  main(receiverEmail);
  return secretCode;
}
/**
 *
 * @param {string} userId
 * @returns {void}
 * 회원 데이터에 있는 이메일을 꺼내서 탈퇴가 완료되었음을 나타내는 이메일을 보냅니다.
 * 탈퇴 전에 호출해야 합니다.
 */
function emailForWithdrawal(userId) {
  const nodemailer = require("nodemailer");
  const dbAcess = require("../db");
  const {
    OAUTH_USER,
    OAUTH_CLIENT_ID,
    OAUTH_CLIENT_SECRET,
    OAUTH_REFRESH_TOKEN,
  } = process.env;
  
  
  
  
  
  // db에서 userId를 가진 user 찾아서 email을 뽑아내는 거 만들어야 함.
    // const receiverEmail= db. 머시기
  //
  
  
  
  async function main(receiverEmail) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.google.com",
      port: 587,
      secure: true,
      auth: {
        type: "OAuth2",
        user: `${OAUTH_USER}`,
        clientId: `${OAUTH_CLIENT_ID}`,
        clientSecret: `${OAUTH_CLIENT_SECRET}`,
        refreshToken: `${OAUTH_REFRESH_TOKEN}`,
      },
    });
    const message = {
      from: OAUTH_USER,
      to: receiverEmail,
      subject: "letmegraduated 앱 회원 탈퇴가 완료되었습니다",
      html: `
      <h1>
        지금까지 사용해주셔서 감사합니다. 더욱 노력하는 letmegraduated가 되겠습니다.
      </h1>
      <hr />
      <br />
      <p>회원 탈퇴 이후에도 언제나 다시 가입하실 수 있으며 자유롭게 사용가능합니다.<p/>
      <p>회원 탈퇴를 하시는 것에 대해서 특별한 사유가 있으시다면 아래 연락처로 연락 바랍니다.</p>
      <p>010-xxxx-xxxx (Team member : codefug)</p>
      <br />
      <hr />
      <p>이 메일은 letmegraduated app 회원 탈퇴 확인을 위해서 전송되었습니다.</p>
    `,
    };
    await transporter.sendMail(message);
  }
  main()//parameter로 receiverEmail 받아야 함.
}
module.exports = { emailForSignUp, emailForWithdrawal };
