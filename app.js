const dotenv = require("dotenv");
const passport = require("passport");
//test용
const bodyParser = require("body-parser");
dotenv.config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const session = require("express-session");
const passportConfig = require("./passport");
const app = express();

// 포트 이름 세팅
app.set("port", process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));
passportConfig();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

//테스트 html
app.get("", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/login.html", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("session"));
app.use(indexRouter);
app.use(authRouter);
app.use(userRouter);
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.send(err + "오류 입니다.");
});

app.listen(app.get("port"), (req, res, next) => {
  console.log(app.get("port") + "에서 대기중");
});

module.exports = app;