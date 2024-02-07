const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');

dotenv.config();
const port = 3000;
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const signupRouter = require("./routes/signup");
const usersRouter = require('./routes/users');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// 호스트
app.set('port', process.env.PORT || 8080);

app.use('/',indexRouter);
app.use('/login',loginRouter);
// app.use('/signup',signupRouter);
app.use('/users', usersRouter);
app.use('/signup',signupRouter);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("오류 발생");
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포에 서버 연결');
  });

module.exports = app;
